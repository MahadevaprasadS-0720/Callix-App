import { db, messaging } from '../config/firebaseAdmin';
import { 
  CallRecord, 
  RiskEvent, 
  NumberReputation, 
  ScamPhraseRule, 
  DecisionEngineResult,
  CreateCallSessionRequest,
  EndCallSessionRequest
} from '../types/backend.types';
import { logger } from '../utils/logger';

export class FirestoreService {
  /**
   * Initialize a new call session document under Firestore calls
   */
  public async createCallSessionDoc(req: CreateCallSessionRequest): Promise<void> {
    try {
      const callRef = db.collection('calls').doc(req.callId);
      const newCall: CallRecord = {
        callId: req.callId,
        uid: req.userId,
        callerNumber: req.callerNumber,
        callerName: req.callerName || 'Unknown Caller',
        startTime: Date.now(),
        status: 'IN_PROGRESS',
        finalScore: 0,
        verdict: 'Legitimate',
        primaryCategory: 'SAFE',
        riskEventsCount: 0,
        guardianNotified: false,
        summaryExplanation: 'Call initialized. Real-time transcription streaming active.',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await callRef.set(newCall);
      logger.info(`Initialized call session ${req.callId} for user ${req.userId}`);
    } catch (err) {
      logger.error(`Error creating call session ${req.callId}`, err);
      throw err;
    }
  }

  /**
   * Add a real-time RiskEvent to the call's subcollection
   */
  public async addRiskEvent(callId: string, event: Omit<RiskEvent, 'eventId' | 'callId'>): Promise<string> {
    try {
      const eventRef = db.collection('calls').doc(callId).collection('riskEvents').doc();
      const newEvent: RiskEvent = {
        ...event,
        eventId: eventRef.id,
        callId,
      };
      await eventRef.set(newEvent);
      return eventRef.id;
    } catch (err) {
      logger.error(`Error adding risk event for call ${callId}`, err);
      throw err;
    }
  }

  /**
   * Update latest score and verdict on call document
   */
  public async updateCallScoreAndVerdict(
    callId: string,
    updates: Partial<CallRecord>
  ): Promise<void> {
    try {
      const callRef = db.collection('calls').doc(callId);
      await callRef.set({
        ...updates,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (err) {
      logger.error(`Error updating score for call ${callId}`, err);
      throw err;
    }
  }

  /**
   * End call session, calculate final metrics and summary
   */
  public async endCallSessionDoc(req: EndCallSessionRequest): Promise<CallRecord | null> {
    try {
      const callRef = db.collection('calls').doc(req.callId);
      const snap = await callRef.get();
      if (!snap.exists) return null;

      const current = snap.data() as CallRecord;
      const endTime = Date.now();
      const durationSeconds = req.durationSeconds || Math.round((endTime - current.startTime) / 1000);

      const finalRecord: Partial<CallRecord> = {
        endTime,
        durationSeconds,
        status: req.status || (current.finalScore >= 75 ? 'FLAGGED' : 'COMPLETED'),
        updatedAt: endTime,
      };

      await callRef.set(finalRecord, { merge: true });
      logger.info(`Finalized call session ${req.callId} - Duration: ${durationSeconds}s, Final Score: ${current.finalScore}`);
      return { ...current, ...finalRecord } as CallRecord;
    } catch (err) {
      logger.error(`Error finalizing call ${req.callId}`, err);
      throw err;
    }
  }

  /**
   * Get caller number reputation from community and telecom database
   */
  public async getNumberReputation(phoneNumber: string): Promise<NumberReputation | null> {
    try {
      const sanitized = phoneNumber.replace(/[^\d+]/g, '');
      const doc = await db.collection('numberReputation').doc(sanitized).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data() as NumberReputation;
    } catch (err) {
      logger.error(`Error retrieving reputation for ${phoneNumber}`, err);
      return null;
    }
  }

  /**
   * Dispatch urgent push and SMS notification to user's registered guardians
   */
  public async notifyGuardians(
    userId: string, 
    callId: string, 
    callerNumber: string, 
    decision: DecisionEngineResult
  ): Promise<void> {
    try {
      const guardiansSnap = await db.collection('users').doc(userId).collection('guardians').get();
      if (guardiansSnap.empty) {
        logger.info(`User ${userId} has no registered guardians for emergency alert.`);
        return;
      }

      const alertPromises = guardiansSnap.docs.map(async (doc: any) => {
        const guardianData = doc.data();
        const alertId = `alert_${Date.now()}_${doc.id}`;
        
        // Log alert record
        await db.collection('guardianAlerts').doc(alertId).set({
          alertId,
          targetUid: userId,
          guardianUid: doc.id,
          guardianPhone: guardianData.phone || '',
          guardianEmail: guardianData.email || '',
          callId,
          callerNumber,
          riskScore: decision.finalScore,
          category: decision.category,
          explanation: decision.explanation,
          status: 'DISPATCHED',
          createdAt: Date.now(),
        });

        // If guardian has FCM push token, send real-time push alert
        if (guardianData.fcmToken) {
          try {
            await messaging.send({
              token: guardianData.fcmToken,
              notification: {
                title: `🚨 HIGH RISK SCAM CALL DETECTED!`,
                body: `Threat Level: ${decision.finalScore}/100 (${decision.category}). Caller: ${callerNumber}. Reason: ${decision.explanation}`,
              },
              data: {
                callId,
                score: String(decision.finalScore),
                category: decision.category,
              },
            });
          } catch (fcmErr) {
            logger.warn(`Failed to send FCM to guardian ${doc.id}`, { fcmErr });
          }
        }
      });

      await Promise.all(alertPromises);
      logger.info(`Emergency alerts dispatched to ${guardiansSnap.size} guardians for call ${callId}`);
    } catch (err) {
      logger.error(`Failed to notify guardians for user ${userId}`, err);
    }
  }

  /**
   * Fetch active scam phrase library rules
   */
  public async getScamPhrases(): Promise<ScamPhraseRule[]> {
    try {
      const snap = await db.collection('scamPhrases').where('isActive', '==', true).get();
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as ScamPhraseRule));
    } catch (err) {
      logger.error('Error fetching scam phrases from firestore', err);
      return [];
    }
  }
}

export const firestoreService = new FirestoreService();
