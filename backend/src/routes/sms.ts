/**
 * SMS Routes — Verification code endpoints.
 *
 * POST /api/sms/send    — Send a 6-digit code to a phone number
 * POST /api/sms/verify  — Verify a code submitted by the user
 */

import { Router, Request, Response } from 'express';
import { sendVerificationCode, verifyCode } from '../services/smsService';

const router = Router();

/**
 * POST /api/sms/send
 * Body: { phoneNumber: string }
 *
 * Sends a verification code to the given phone number.
 * Rate limited: 1 per 60 seconds per number.
 */
router.post('/sms/send', async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: '请提供手机号',
    });
  }

  const result = await sendVerificationCode(phoneNumber);

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

/**
 * POST /api/sms/verify
 * Body: { phoneNumber: string, code: string }
 *
 * Verifies the code. Single-use — a verified code cannot be reused.
 */
router.post('/sms/verify', (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({
      success: false,
      message: '请提供手机号和验证码',
    });
  }

  const result = verifyCode(phoneNumber, code);

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

export default router;
