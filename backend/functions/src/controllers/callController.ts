import { Request, Response } from 'firebase-functions';
import { claudeScoringService } from '../services/claudeScoringService';
import { defaultDecisionEngine } from '../rules/decisionEngine';
import { firestoreService } from '../services/firestoreService';
import { handleError, AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

/**
 * Initialize a new call session in Firestore
 */
export const createCallSessionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId, userId, callerNumber, callerName } = req.body;

    if (!callId || !userId || !callerNumber) {
      throw new AppError(400, 'Missing required fields: callId, userId, callerNumber');
    }

    await firestoreService.createCallSessionDoc({
      callId,
      userId,
      callerNumber,
      callerName,
    });

    res.status(201).json({
      success: true,
      message: 'Call session initialized successfully',
      callId,
    });
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * Score incoming speech segment in real time with Claude + Decision Engine,
 * record a RiskEvent subcollection document, and update the parent call record.
 */
export const analyzeLiveTranscriptHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      callId, 
      userId, 
      callerNumber, 
      textSegment, 
      timestamp, 
      timestampOffset = 0,
      fullTranscriptHistory = '' 
    } = req.body;

    if (!callId || !userId || !callerNumber || !textSegment) {
      throw new AppError(400, 'Missing required parameters: callId, userId, callerNumber, textSegment');
    }

    logger.info(`Analyzing live transcript chunk for call ${callId}: "${textSegment.substring(0, 40)}..."`);

    // 1. Fetch caller reputation
    const callerRep = await firestoreService.getNumberReputation(callerNumber);

    // 2. Score with Anthropic Claude NLP Engine
    const claudeResult = await claudeScoringService.scoreTranscriptChunk(
      textSegment,
      fullTranscriptHistory,
      callerNumber
    );

    // 3. Evaluate combined score through Decision Engine
    const decision = defaultDecisionEngine.evaluate(
      claudeResult,
      textSegment,
      callerRep
    );

    // 4. If elevated risk (>= 40) or flagged trigger phrases, write riskEvent subdocument
    let eventId: string | undefined;
    if (decision.finalScore >= 40 || decision.triggerPhrases.length > 0) {
      eventId = await firestoreService.addRiskEvent(callId, {
        score: decision.finalScore,
        category: decision.category,
        triggerPhrase: decision.triggerPhrases[0] || textSegment.substring(0, 60),
        modelExplanation: decision.explanation,
        timestampOffset: timestampOffset || (typeof timestamp === 'number' ? timestamp : 0),
        createdAt: Date.now(),
      });
    }

    // 5. Update call record with latest score, verdict, and category
    await firestoreService.updateCallScoreAndVerdict(callId, {
      finalScore: decision.finalScore,
      verdict: decision.verdict,
      primaryCategory: decision.category,
      summaryExplanation: decision.explanation,
    });

    // 6. If high-risk threshold reached, dispatch emergency alerts to registered family guardians
    if (decision.requiresGuardianAlert) {
      await firestoreService.notifyGuardians(userId, callId, callerNumber, decision);
      await firestoreService.updateCallScoreAndVerdict(callId, { guardianNotified: true });
    }

    res.status(200).json({
      success: true,
      callId,
      eventId,
      claudeResult,
      decision,
    });
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * Finalize call session, aggregate metrics, generate summary, commit final verdict
 */
export const endCallSessionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId, durationSeconds, status } = req.body;

    if (!callId) {
      throw new AppError(400, 'Missing callId');
    }

    const finalRecord = await firestoreService.endCallSessionDoc({
      callId,
      durationSeconds: durationSeconds || 0,
      status: status || 'COMPLETED',
    });

    res.status(200).json({
      success: true,
      message: 'Call session ended and finalized',
      data: finalRecord,
    });
  } catch (err) {
    handleError(res, err);
  }
};
