/**
 * SmsService — Tencent Cloud SMS integration for verification codes.
 *
 * Features:
 *   - Send 6-digit verification code via Tencent Cloud SMS API
 *   - In-memory code store with 5-minute expiration
 *   - Rate limiting: 1 send per 60 seconds per phone number
 *   - Verify code with single-use consumption
 *   - Dev fallback: logs code to console when SMS credentials/template not configured
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tencentcloud = require('tencentcloud-sdk-nodejs');
const SmsClient = tencentcloud.sms.v20210111.Client;

/** Verification code entry in the in-memory store. */
interface CodeEntry {
  code: string;
  expiresAt: number;
  consumed: boolean;
}

/** Rate limit entry: earliest next-allowed send time. */
interface RateLimitEntry {
  nextAllowedAt: number;
}

/** In-memory stores (resets on server restart — fine for MVP). */
const codeStore = new Map<string, CodeEntry>();
const rateLimitStore = new Map<string, RateLimitEntry>();

/** Code expiration: 5 minutes. */
const CODE_EXPIRY_MS = 5 * 60 * 1000;

/** Rate limit: 60 seconds between sends per phone number. */
const RATE_LIMIT_MS = 60 * 1000;

/** SMS client instance (lazy-initialized). */
let smsClient: typeof SmsClient | null = null;

/**
 * Lazily initializes the Tencent Cloud SMS client.
 * Returns null if credentials are not configured (dev mode).
 */
function getSmsClient(): typeof SmsClient | null {
  if (smsClient) return smsClient;

  const secretId = process.env.TENCENT_CLOUD_SECRET_ID;
  const secretKey = process.env.TENCENT_CLOUD_SECRET_KEY;

  if (!secretId || !secretKey) {
    console.warn('[SMS] TENCENT_CLOUD_SECRET_ID/SECRET_KEY not set — SMS will run in dev mode (codes logged to console)');
    return null;
  }

  smsClient = new SmsClient({
    credential: { secretId, secretKey },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: { endpoint: 'sms.tencentcloudapi.com' },
    },
  });

  return smsClient;
}

/**
 * Generates a random 6-digit verification code.
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validates a Chinese mobile phone number (11 digits starting with 1).
 */
function isValidPhoneNumber(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * Sends a verification code to the given phone number.
 *
 * - Rate limited: 1 per 60 seconds per number
 * - Code expires in 5 minutes
 * - In dev mode (no SMS config), logs the code to console
 *
 * @param phoneNumber - Chinese mobile number (11 digits, starts with 1)
 * @returns Object with success status and message
 */
export async function sendVerificationCode(
  phoneNumber: string
): Promise<{ success: boolean; message: string }> {
  // Validate phone number
  if (!isValidPhoneNumber(phoneNumber)) {
    return { success: false, message: '手机号格式不正确' };
  }

  // Rate limit check
  const rateLimit = rateLimitStore.get(phoneNumber);
  const now = Date.now();
  if (rateLimit && now < rateLimit.nextAllowedAt) {
    const waitSeconds = Math.ceil((rateLimit.nextAllowedAt - now) / 1000);
    return {
      success: false,
      message: `发送过于频繁，请${waitSeconds}秒后重试`,
    };
  }

  // Generate code
  const code = generateCode();
  const expiresAt = now + CODE_EXPIRY_MS;

  // Try to send via Tencent Cloud SMS
  const client = getSmsClient();
  const signName = process.env.TENCENT_SMS_SIGN_NAME;
  const templateId = process.env.TENCENT_SMS_TEMPLATE_ID;
  const appId = process.env.TENCENT_SMS_APP_ID;

  if (!client || !signName || !templateId || !appId) {
    // Dev mode: log code to console
    console.log(`[SMS Dev Mode] 验证码: ${code} (手机号: ${phoneNumber}, ${CODE_EXPIRY_MS / 60000}分钟内有效)`);
    codeStore.set(phoneNumber, { code, expiresAt, consumed: false });
    rateLimitStore.set(phoneNumber, { nextAllowedAt: now + RATE_LIMIT_MS });
    return {
      success: true,
      message: '验证码已发送（开发模式：请查看服务器控制台）',
    };
  }

  try {
    // Tencent SMS template parameters: {1} = code, {2} = expiry minutes
    const expiryMinutes = String(CODE_EXPIRY_MS / 60000);

    const response = await client.SendSms({
      SmsSdkAppId: appId,
      SignName: signName,
      TemplateId: templateId,
      PhoneNumberSet: [`+86${phoneNumber}`],
      TemplateParamSet: [code, expiryMinutes],
    });

    // Check delivery status
    const sendStatus = response?.SendStatusSet?.[0];
    if (sendStatus && sendStatus.Code === 'Ok') {
      codeStore.set(phoneNumber, { code, expiresAt, consumed: false });
      rateLimitStore.set(phoneNumber, { nextAllowedAt: now + RATE_LIMIT_MS });
      console.log(`[SMS] Verification code sent to ${phoneNumber}`);
      return { success: true, message: '验证码已发送' };
    } else {
      const errorMsg = sendStatus?.Message || '短信发送失败';
      console.error('[SMS] Send failed:', sendStatus);
      return { success: false, message: errorMsg };
    }
  } catch (error) {
    console.error('[SMS] Error sending code:', error);
    return {
      success: false,
      message: '短信发送失败，请稍后重试',
    };
  }
}

/**
 * Verifies a code for the given phone number.
 * Consumes the code (single-use) on successful verification.
 *
 * @param phoneNumber - Chinese mobile number
 * @param code - 6-digit code entered by user
 * @returns Object with success status and message
 */
export function verifyCode(
  phoneNumber: string,
  code: string
): { success: boolean; message: string } {
  const entry = codeStore.get(phoneNumber);

  if (!entry) {
    return { success: false, message: '请先获取验证码' };
  }

  if (entry.consumed) {
    return { success: false, message: '验证码已使用，请重新获取' };
  }

  if (Date.now() > entry.expiresAt) {
    codeStore.delete(phoneNumber);
    return { success: false, message: '验证码已过期，请重新获取' };
  }

  if (entry.code !== code) {
    return { success: false, message: '验证码不正确' };
  }

  // Success — consume the code
  entry.consumed = true;
  codeStore.set(phoneNumber, entry);
  console.log(`[SMS] Code verified for ${phoneNumber}`);
  return { success: true, message: '验证成功' };
}

/**
 * Periodic cleanup: removes expired codes and stale rate limit entries.
 * Call this every few minutes to prevent memory leaks.
 */
export function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [phone, entry] of codeStore.entries()) {
    if (now > entry.expiresAt) {
      codeStore.delete(phone);
    }
  }
  for (const [phone, entry] of rateLimitStore.entries()) {
    if (now > entry.nextAllowedAt) {
      rateLimitStore.delete(phone);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);
