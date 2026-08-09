/**
 * Auth Routes — User registration, login, CAPTCHA, and profile.
 *
 * Endpoints:
 *   GET  /api/auth/captcha   — Get CAPTCHA image (SVG) + session ID
 *   POST /api/auth/register  — Register with phone + password + captcha
 *   POST /api/auth/login     — Login with phone + password
 *   GET  /api/auth/me        — Get current user profile (requires JWT)
 */

import { Router, Request, Response } from 'express';
import { generateCaptcha, verifyCaptcha } from '../services/captchaService';
import { registerUser, loginUser } from '../services/authService';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * GET /api/auth/captcha
 *
 * Returns a CAPTCHA image (SVG) and a session ID.
 * The session ID must be included in the registration request.
 *
 * Response: { success, sessionId, svg }
 */
router.get('/auth/captcha', (_req: Request, res: Response) => {
  const { sessionId, svg } = generateCaptcha();
  res.json({
    success: true,
    sessionId,
    svg,
  });
});

/**
 * POST /api/auth/register
 *
 * Body: { phone, password, captchaSessionId, captchaText }
 *
 * Creates a new user account and returns a JWT token.
 * The CAPTCHA must be valid and not expired.
 *
 * Response: { success, message, user: { id, phone, nickname, createdAt }, token }
 */
router.post('/auth/register', (req: Request, res: Response) => {
  const { phone, password, captchaSessionId, captchaText } = req.body;

  // Validate required fields
  if (!phone || !password || !captchaSessionId || !captchaText) {
    res.status(400).json({
      success: false,
      message: '请填写所有必填字段',
    });
    return;
  }

  // Verify CAPTCHA first (before hitting the database)
  const captchaValid = verifyCaptcha(captchaSessionId, captchaText);
  if (!captchaValid) {
    res.status(400).json({
      success: false,
      message: '验证码不正确或已过期',
    });
    return;
  }

  // Attempt registration
  try {
    const { user, token } = registerUser(phone, password);
    res.status(201).json({
      success: true,
      message: '注册成功',
      user,
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '注册失败';
    res.status(400).json({
      success: false,
      message,
    });
  }
});

/**
 * POST /api/auth/login
 *
 * Body: { phone, password }
 *
 * Authenticates the user and returns a JWT token.
 *
 * Response: { success, message, user: { id, phone, nickname, createdAt }, token }
 */
router.post('/auth/login', (req: Request, res: Response) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({
      success: false,
      message: '请输入手机号和密码',
    });
    return;
  }

  try {
    const { user, token } = loginUser(phone, password);
    res.json({
      success: true,
      message: '登录成功',
      user,
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    res.status(400).json({
      success: false,
      message,
    });
  }
});

/**
 * GET /api/auth/me
 *
 * Returns the current user's profile (requires valid JWT in Authorization header).
 *
 * Response: { success, user: { id, phone, nickname, createdAt } }
 */
router.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
