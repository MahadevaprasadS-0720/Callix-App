import { Request, Response } from 'firebase-functions';
import { firestoreService } from '../services/firestoreService';
import { db } from '../config/firebaseAdmin';
import { handleError, AppError } from '../utils/errorHandler';
import { NumberReputation } from '../types/backend.types';

export const lookupNumberHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const phoneNumber = (req.query.phone || req.body.phone) as string;
    if (!phoneNumber) {
      throw new AppError(400, 'Query parameter "phone" is required');
    }

    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    let reputation = await firestoreService.getNumberReputation(cleanPhone);

    // If not found in DB, return default heuristic assessment
    if (!reputation) {
      const isSuspectPrefix = cleanPhone.startsWith('+92') || cleanPhone.startsWith('+93') || cleanPhone.startsWith('+140');
      reputation = {
        phoneNumber: cleanPhone,
        reputationScore: isSuspectPrefix ? 65 : 10,
        reportsCount: 0,
        lastReportedCategory: isSuspectPrefix ? 'IMPERSONATION' : 'NONE',
        tags: isSuspectPrefix ? ['International VoIP', 'Suspicious Gateway'] : ['Verified Mobile'],
        isBlacklisted: false,
        carrier: 'Telecom Network Operator',
        location: 'India',
      };
    }

    res.status(200).json({
      success: true,
      data: reputation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const reportNumberHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, category, description, tags = [] } = req.body;
    if (!phoneNumber || !category) {
      throw new AppError(400, 'Missing phoneNumber or category');
    }

    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const docRef = db.collection('numberReputation').doc(cleanPhone);
    const existing = await docRef.get();

    if (existing.exists) {
      const data = existing.data() as NumberReputation;
      const updatedReports = (data.reportsCount || 0) + 1;
      const updatedScore = Math.min(100, (data.reputationScore || 0) + 15);
      await docRef.set({
        ...data,
        reportsCount: updatedReports,
        reputationScore: updatedScore,
        lastReportedCategory: category,
        isBlacklisted: updatedScore >= 80,
        tags: Array.from(new Set([...(data.tags || []), ...tags])),
        updatedAt: Date.now(),
      }, { merge: true });
    } else {
      const newEntry: NumberReputation = {
        phoneNumber: cleanPhone,
        reputationScore: 40,
        reportsCount: 1,
        lastReportedCategory: category,
        tags,
        isBlacklisted: false,
        carrier: 'Reported Caller',
        location: 'India',
      };
      await docRef.set({
        ...newEntry,
        createdAt: Date.now(),
      });
    }

    // Also store individual report log
    await db.collection('scamReports').add({
      phoneNumber: cleanPhone,
      category,
      description: description || '',
      reportedAt: Date.now(),
    });

    res.status(200).json({
      success: true,
      message: 'Scam report registered successfully',
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getPhraseLibraryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const phrases = await firestoreService.getScamPhrases();
    res.status(200).json({
      success: true,
      count: phrases.length,
      data: phrases,
    });
  } catch (err) {
    handleError(res, err);
  }
};
