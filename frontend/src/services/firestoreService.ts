import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { CallRecord, RiskEvent } from '../types/call.types';
import { NumberReputation, ScamCategory } from '../types/fraud.types';
import { analyzeTelecomNumber } from '../utils/telecomIntelligence';

const CALLS_STORAGE_KEY = 'audio_guardian_calls_db';
const RISK_EVENTS_STORAGE_KEY = 'audio_guardian_risk_events_db';
const NUMBER_REPUTATION_KEY = 'audio_guardian_number_reputation_db';

// Clean out legacy hardcoded mock calls so new installations start with accurate zero state
const purgeLegacyMockCalls = () => {
  try {
    const raw = localStorage.getItem(CALLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleanCalls = parsed.filter(
          (c: any) => !['call_1', 'call_2', 'call_3', 'call_4', 'call_5'].includes(c.callId)
        );
        if (cleanCalls.length !== parsed.length) {
          localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(cleanCalls));
        }
      }
    }
  } catch {}
};

purgeLegacyMockCalls();

export const firestoreService = {
  /**
   * Fetch all calls from Firestore or local persistent cache.
   * Returns empty array [] if no calls exist (never returns mock data).
   */
  getCalls: async (): Promise<CallRecord[]> => {
    let localCalls: CallRecord[] = [];
    const stored = localStorage.getItem(CALLS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localCalls = parsed.filter(
            (c: any) => !['call_1', 'call_2', 'call_3', 'call_4', 'call_5'].includes(c.callId)
          );
        }
      } catch {}
    }

    try {
      if (db) {
        const callsCol = collection(db, 'calls');
        const q = query(callsCol, orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteCalls: CallRecord[] = snapshot.docs.map((d) => ({
            callId: d.id,
            ...(d.data() as Omit<CallRecord, 'callId'>),
          }));
          localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(remoteCalls));
          return remoteCalls;
        }
      }
    } catch (err) {
      // Graceful fallback to local storage
    }

    return localCalls;
  },

  /**
   * Subscribe to real-time call collection updates with instant local callback
   */
  subscribeToCalls: (callback: (calls: CallRecord[]) => void): (() => void) => {
    // Immediately emit current local state
    firestoreService.getCalls().then(callback);

    if (db) {
      try {
        const callsCol = collection(db, 'calls');
        const q = query(callsCol, orderBy('createdAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const calls: CallRecord[] = snapshot.docs.map((d) => ({
              callId: d.id,
              ...(d.data() as Omit<CallRecord, 'callId'>),
            }));
            localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
            callback(calls);
          },
          () => {
            // If offline, maintain local calls
          }
        );
        return unsubscribe;
      } catch {
        // Fallback
      }
    }

    return () => {};
  },

  getCallById: async (callId: string): Promise<CallRecord | null> => {
    const calls = await firestoreService.getCalls();
    return calls.find((c: CallRecord) => c.callId === callId) || null;
  },

  saveCallRecord: async (call: CallRecord): Promise<void> => {
    const calls = await firestoreService.getCalls();
    const existingIndex = calls.findIndex((c: CallRecord) => c.callId === call.callId);
    let updatedCalls: CallRecord[];
    if (existingIndex >= 0) {
      updatedCalls = [...calls];
      updatedCalls[existingIndex] = call;
    } else {
      updatedCalls = [call, ...calls];
    }
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(updatedCalls));

    if (db) {
      try {
        const docRef = doc(db, 'calls', call.callId);
        await setDoc(docRef, call, { merge: true });
      } catch (err) {
        console.warn('Firestore write note:', err);
      }
    }
  },

  saveCall: async (call: CallRecord): Promise<void> => {
    return firestoreService.saveCallRecord(call);
  },

  deleteCall: async (callId: string): Promise<void> => {
    const calls = await firestoreService.getCalls();
    const updatedCalls = calls.filter((c: CallRecord) => c.callId !== callId);
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(updatedCalls));

    if (db) {
      try {
        await deleteDoc(doc(db, 'calls', callId));
      } catch {}
    }
  },

  clearCallRecords: (): CallRecord[] => {
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  resetDemoCalls: (): CallRecord[] => {
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  saveRiskEvent: async (callId: string, event: RiskEvent): Promise<void> => {
    const key = `${RISK_EVENTS_STORAGE_KEY}_${callId}`;
    const stored = localStorage.getItem(key);
    let events: RiskEvent[] = [];
    if (stored) {
      try {
        events = JSON.parse(stored);
      } catch {
        events = [];
      }
    }
    events.push(event);
    localStorage.setItem(key, JSON.stringify(events));

    if (db) {
      try {
        const ref = doc(db, 'calls', callId, 'riskEvents', event.eventId || `evt_${Date.now()}`);
        await setDoc(ref, event, { merge: true });
      } catch {}
    }
  },

  /**
   * Real-time query for Phone Number Reputation & Telecom Intelligence
   */
  getNumberReputation: async (rawPhone: string): Promise<NumberReputation> => {
    const cleanedDigits = rawPhone.replace(/[^\d+]/g, '');

    // 1. Check local persistent repository
    const storedDb = localStorage.getItem(NUMBER_REPUTATION_KEY);
    let localReputationMap: Record<string, NumberReputation> = {};
    if (storedDb) {
      try {
        localReputationMap = JSON.parse(storedDb);
      } catch {}
    }

    if (localReputationMap[cleanedDigits]) {
      return localReputationMap[cleanedDigits];
    }

    // 2. Query Firestore if online
    if (db) {
      try {
        const docSnap = await getDoc(doc(db, 'numberReputation', cleanedDigits));
        if (docSnap.exists()) {
          return docSnap.data() as NumberReputation;
        }
      } catch (err) {
        console.warn('Firestore number reputation query fallback', err);
      }
    }

    // 3. Dynamic Multi-Tier Telecom Intelligence Analyzer
    const dossier = analyzeTelecomNumber(rawPhone, 0, 'SAFE');

    return {
      phoneNumber: rawPhone,
      reputationScore: dossier.threatScore,
      totalReports: 0,
      lastReportedCategory: dossier.tier === 'TELEMARKETING_PROMOTIONAL' ? 'IMPERSONATION' : 'SAFE',
      callerNameSuggestion: dossier.suggestedName,
      carrier: dossier.carrierName,
      location: dossier.telecomCircle,
      tags: dossier.tags,
      isBlacklisted: dossier.threatScore >= 75,
      communityComments: [],
    };
  },

  /**
   * Submit and persist a Community Scam Report for a phone number
   */
  reportFraudNumber: async (payload: {
    phoneNumber: string;
    category: ScamCategory;
    description: string;
    authorName?: string;
  }): Promise<NumberReputation> => {
    const cleanedDigits = payload.phoneNumber.replace(/[^\d+]/g, '');
    const existing = await firestoreService.getNumberReputation(cleanedDigits);

    const newComment = {
      id: `comm_${Date.now()}`,
      author: payload.authorName || 'Verified Guardian User',
      comment: payload.description,
      category: payload.category,
      date: new Date().toISOString().slice(0, 10),
    };

    const updatedTotalReports = existing.totalReports + 1;
    const updatedScore = Math.min(100, Math.max(75, existing.reputationScore + 30));

    const updatedProfile: NumberReputation = {
      ...existing,
      phoneNumber: payload.phoneNumber,
      reputationScore: updatedScore,
      totalReports: updatedTotalReports,
      lastReportedCategory: payload.category,
      isBlacklisted: true,
      tags: Array.from(
        new Set([
          ...existing.tags.filter((t) => !t.includes('Clean')),
          'Reported Fraudster',
          'Community Flagged',
          payload.category,
        ])
      ),
      communityComments: [newComment, ...(existing.communityComments || [])],
    };

    const storedDb = localStorage.getItem(NUMBER_REPUTATION_KEY);
    let localMap: Record<string, NumberReputation> = {};
    if (storedDb) {
      try {
        localMap = JSON.parse(storedDb);
      } catch {}
    }
    localMap[cleanedDigits] = updatedProfile;
    localStorage.setItem(NUMBER_REPUTATION_KEY, JSON.stringify(localMap));

    if (db) {
      try {
        await setDoc(doc(db, 'numberReputation', cleanedDigits), updatedProfile, { merge: true });
      } catch (err) {
        console.warn('Firestore report write note', err);
      }
    }

    return updatedProfile;
  },

  /**
   * Subscribe to real-time updates for a single Call document
   */
  subscribeToCall: (callId: string, callback: (call: CallRecord | null) => void): (() => void) => {
    if (db) {
      try {
        const unsub = onSnapshot(
          doc(db, 'calls', callId),
          (snap) => {
            if (snap.exists()) {
              callback({ callId: snap.id, ...snap.data() } as CallRecord);
            } else {
              callback(null);
            }
          },
          () => {}
        );
        return unsub;
      } catch {}
    }

    const interval = setInterval(async () => {
      const call = await firestoreService.getCallById(callId);
      callback(call);
    }, 1000);

    return () => clearInterval(interval);
  },

  /**
   * Subscribe to real-time RiskEvents subcollection
   */
  subscribeToRiskEvents: (callId: string, callback: (events: RiskEvent[]) => void): (() => void) => {
    if (db) {
      try {
        const q = query(collection(db, 'calls', callId, 'riskEvents'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(
          q,
          (snap) => {
            const evts = snap.docs.map((d) => ({
              eventId: d.id,
              ...(d.data() as Omit<RiskEvent, 'eventId'>),
            }));
            callback(evts);
          },
          () => {}
        );
        return unsub;
      } catch {}
    }

    return () => {};
  },
};
