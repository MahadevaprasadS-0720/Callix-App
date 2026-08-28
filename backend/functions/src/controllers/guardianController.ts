import { Request, Response } from 'firebase-functions';
import { db } from '../config/firebaseAdmin';
import { handleError, AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export const registerGuardianHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, guardianId, name, phone, email, relationship, fcmToken } = req.body;

    if (!userId || !guardianId || !name || !phone) {
      throw new AppError(400, 'Missing required fields: userId, guardianId, name, phone');
    }

    const guardianRef = db.collection('users').doc(userId).collection('guardians').doc(guardianId);
    await guardianRef.set({
      guardianId,
      name,
      phone,
      email: email || '',
      relationship: relationship || 'Family',
      fcmToken: fcmToken || null,
      notificationsEnabled: true,
      createdAt: Date.now(),
    }, { merge: true });

    logger.info(`Registered guardian ${name} (${phone}) for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Guardian linked successfully',
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const listGuardianAlertsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { guardianUid, targetUid } = req.query;

    let query: any = db.collection('guardianAlerts');

    if (guardianUid) {
      query = query.where('guardianUid', '==', guardianUid);
    } else if (targetUid) {
      query = query.where('targetUid', '==', targetUid);
    }

    const snap = await query.orderBy('createdAt', 'desc').limit(50).get();
    const alerts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (err) {
    handleError(res, err);
  }
};
