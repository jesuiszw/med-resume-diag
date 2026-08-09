/**
 * CaptchaService — SVG-based CAPTCHA generation and verification.
 *
 * Uses svg-captcha (no external API needed, generates SVG images in-process).
 * In-memory store with 5-minute expiration per session ID.
 *
 * Flow:
 *   1. Frontend calls GET /api/auth/captcha → gets { sessionId, svg }
 *   2. Frontend displays the SVG image and asks user to type the text
 *   3. Frontend sends captcha text + sessionId with registration request
 *   4. Backend verifies the text matches the stored captcha for that session
 */

import svgCaptcha from 'svg-captcha';

/** CAPTCHA entry in the in-memory store. */
interface CaptchaEntry {
  text: string;
  expiresAt: number;
}

/** In-memory CAPTCHA store: sessionId → captcha data. */
const captchaStore = new Map<string, CaptchaEntry>();

/** CAPTCHA expiration: 5 minutes. */
const CAPTCHA_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Generates a new CAPTCHA and returns the SVG image + session ID.
 * The caller must store the sessionId and send it back with the registration request.
 *
 * @returns Object with sessionId (string) and svg (SVG image data URL)
 */
export function generateCaptcha(): {
  sessionId: string;
  svg: string;
} {
  // Generate a 4-character alphanumeric CAPTCHA (no confusing chars like O/0/I/1)
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0O1ilI',
    noise: 3,
    color: true,
    background: '#f0f2f5',
  });

  // Generate a unique session ID
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const expiresAt = Date.now() + CAPTCHA_EXPIRY_MS;

  captchaStore.set(sessionId, {
    text: captcha.text.toLowerCase(),
    expiresAt,
  });

  return {
    sessionId,
    svg: captcha.data,
  };
}

/**
 * Verifies a CAPTCHA response for the given session ID.
 * Consumes the CAPTCHA (single-use) on successful verification.
 *
 * @param sessionId - The session ID returned by generateCaptcha
 * @param userInput - The text the user typed
 * @returns true if the CAPTCHA matches and is not expired
 */
export function verifyCaptcha(
  sessionId: string,
  userInput: string
): boolean {
  const entry = captchaStore.get(sessionId);

  if (!entry) {
    return false;
  }

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    captchaStore.delete(sessionId);
    return false;
  }

  // Case-insensitive comparison
  const isMatch = entry.text === userInput.toLowerCase();

  // Single-use: delete after verification attempt
  captchaStore.delete(sessionId);

  return isMatch;
}

/**
 * Periodic cleanup: removes expired CAPTCHA entries.
 */
export function cleanupExpiredCaptchas(): void {
  const now = Date.now();
  for (const [sessionId, entry] of captchaStore.entries()) {
    if (now > entry.expiresAt) {
      captchaStore.delete(sessionId);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCaptchas, 5 * 60 * 1000);
