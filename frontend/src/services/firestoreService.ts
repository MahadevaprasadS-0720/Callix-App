import { CallRecord, RiskEvent } from '../types/call.types';
import { NumberReputation, ScamCategory } from '../types/fraud.types';
import { MOCK_CALLS, MOCK_NUMBER_REPUTATION_DB } from './mockDataService';
import { db } from '../config/firebaseConfig';
import { analyzeTelecomNumber } from '../utils/telecomIntelligence';

const CALLS_STORAGE_KEY = 'audio_guardian_calls_db';
const RISK_EVENTS_STORAGE_KEY = 'audio_guardian_risk_events_db';
const NUMBER_REPUTATION_KEY = 'audio_guardian_number_reputation_db';

export const firestoreService = {
  getCalls: async (): Promise<CallRecord[]> => {
    const stored = localStorage.getItem(CALLS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: CallRecord[] = JSON.parse(stored);
        if (parsed && parsed.length > 0) return parsed;
      } catch {}
    }
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(MOCK_CALLS));
    return MOCK_CALLS;
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
  },

  /**
   * Real-time query for Phone Number Reputation & Telecom Intelligence
   */
  getNumberReputation: async (rawPhone: string): Promise<NumberReputation> => {
    const cleanedDigits = rawPhone.replace(/[^\d+]/g, '');
    const normalizedDigitsOnly = rawPhone.replace(/\D/g, '');

    // 1. Check local persistent repository
    const storedDb = localStorage.getItem(NUMBER_REPUTATION_KEY);
    let localReputationMap: Record<string, NumberReputation> = { ...MOCK_NUMBER_REPUTATION_DB };
    if (storedDb) {
      try {
        localReputationMap = { ...localReputationMap, ...JSON.parse(storedDb) };
      } catch {}
    }

    // Direct lookup in known blacklist
    if (localReputationMap[cleanedDigits]) {
      return localReputationMap[cleanedDigits];
    }

    // Check with/without +91 prefix
    for (const key of Object.keys(localReputationMap)) {
      const keyDigits = key.replace(/\D/g, '');
      if (keyDigits.endsWith(normalizedDigitsOnly) || normalizedDigitsOnly.endsWith(keyDigits)) {
        return localReputationMap[key];
      }
    }

    // 2. Query Firestore if online
    if (db && typeof (db as any).collection === 'function') {
      try {
        const doc = await (db as any).collection('numberReputation').doc(cleanedDigits).get();
        if (doc.exists) {
          return doc.data() as NumberReputation;
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

    // Get current record
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
      tags: Array.from(new Set([...existing.tags.filter(t => !t.includes('Clean')), 'Reported Fraudster', 'Community Flagged', payload.category])),
      communityComments: [newComment, ...(existing.communityComments || [])],
    };

    // Save to local storage
    const storedDb = localStorage.getItem(NUMBER_REPUTATION_KEY);
    let localMap: Record<string, NumberReputation> = { ...MOCK_NUMBER_REPUTATION_DB };
    if (storedDb) {
      try {
        localMap = { ...localMap, ...JSON.parse(storedDb) };
      } catch {}
    }
    localMap[cleanedDigits] = updatedProfile;
    localStorage.setItem(NUMBER_REPUTATION_KEY, JSON.stringify(localMap));

    // Save to Firestore if online
    if (db && typeof (db as any).collection === 'function') {
      try {
        await (db as any).collection('numberReputation').doc(cleanedDigits).set(updatedProfile);
      } catch (err) {
        console.warn('Firestore report write fallback to local storage', err);
      }
    }

    return updatedProfile;
  },

  /**
   * Subscribe to real-time updates for a single Call document
   */
  subscribeToCall: (callId: string, callback: (call: CallRecord | null) => void): (() => void) => {
    if (db && typeof (db as any).collection === 'function') {
      try {
        const unsub = (db as any).collection('calls').doc(callId).onSnapshot((doc: any) => {
          if (doc.exists) {
            callback(doc.data() as CallRecord);
          } else {
            callback(null);
          }
        });
        return unsub;
      } catch (err) {
        console.warn('Firestore live listener fallback', err);
      }
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
    if (db && typeof (db as any).collection === 'function') {
      try {
        const unsub = (db as any)
          .collection('calls')
          .doc(callId)
          .collection('riskEvents')
          .orderBy('createdAt', 'asc')
          .onSnapshot((snap: any) => {
            const evts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
            callback(evts);
          });
        return unsub;
      } catch (err) {
        console.warn('Firestore risk events listener fallback', err);
      }
    }

    return () => {};
  },
};
