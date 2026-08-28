import * as functions from 'firebase-functions';
import cors from 'cors';
import { 
  createCallSessionHandler,
  analyzeLiveTranscriptHandler,
  endCallSessionHandler 
} from './controllers/callController';
import { analyzeAudioFileHandler } from './controllers/audioForensicsController';
import { 
  lookupNumberHandler, 
  reportNumberHandler, 
  getPhraseLibraryHandler 
} from './controllers/fraudController';
import { 
  registerGuardianHandler, 
  listGuardianAlertsHandler 
} from './controllers/guardianController';
import { logger } from './utils/logger';

const corsHandler = cors({ origin: true });

// HTTP Endpoint: Audio File Scam & Deepfake Voice Forensic Analyzer
export const analyzeAudioFile = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    analyzeAudioFileHandler(req, res);
  });
});

// HTTP Endpoint: Initialize Call Session
export const createCallSession = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    createCallSessionHandler(req, res);
  });
});

// HTTP Endpoint: Real-time Transcript Chunk Scoring (Claude + Decision Engine)
export const analyzeLiveTranscript = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    analyzeLiveTranscriptHandler(req, res);
  });
});

// HTTP Endpoint: End Call Session & Aggregate Summary
export const endCallSession = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    endCallSessionHandler(req, res);
  });
});

// HTTP Endpoint: Caller ID & Scam Reputation Lookup
export const lookupPhoneNumber = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    lookupNumberHandler(req, res);
  });
});

// HTTP Endpoint: Crowd-sourced Fraud Number Reporting
export const reportFraudNumber = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    reportNumberHandler(req, res);
  });
});

// HTTP Endpoint: Scam Phrase & Pattern Library
export const getScamPhraseLibrary = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    getPhraseLibraryHandler(req, res);
  });
});

// HTTP Endpoint: Register / Link Family Guardian
export const registerGuardian = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    registerGuardianHandler(req, res);
  });
});

// HTTP Endpoint: List Guardian Alerts
export const listGuardianAlerts = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, () => {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    listGuardianAlertsHandler(req, res);
  });
});

// Firestore Trigger: Automatically assess final call statistics upon call completion
export const onCallRecordUpdated = functions.firestore
  .document('calls/{callId}')
  .onUpdate(async (change: any, context: any) => {
    const callId = context.params.callId;
    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (!beforeData?.endTime && afterData?.endTime) {
      logger.info(`Call ${callId} completed. Final score: ${afterData.finalScore}, Verdict: ${afterData.verdict}`);
    }
  });
