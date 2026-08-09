/**
 * Auth Middleware — JWT token verification for protected routes.
 *
 * Usage:
 *   import { requireAuth } from '../middleware/authMiddleware';
 *   router.get('/profile', requireAuth, (req, res) => { ... });
 *
 * On success: req.user is set to { id, phone, nickname, createdAt }
 * On failure: 401 response with error message
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, findUserById, SafeUser } from '../services/authService';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

/**
 * Middleware that requires a valid JWT token.
 * Extracts the token from the Authorization header (Bearer scheme).
 * On success, attaches the user object to req.user.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: '请先登录' });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, message: '登录已过期，请重新登录' });
    return;
  }

  const user = findUserById(payload.userId);
  if (!user) {
    res.status(401).json({ success: false, message: '用户不存在' });
    return;
  }

  // Attach user to request for downstream handlers
  req.user = user;
  next();
}

/**
 * Optional auth middleware: attaches user if token is present,
 * but does not reject if no token or token is invalid.
 * Useful for routes that serve both authenticated and anonymous users.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (payload) {
    const user = findUserById(payload.userId);
    if (user) {
      req.user = user;
    }
  }

  next();
}
