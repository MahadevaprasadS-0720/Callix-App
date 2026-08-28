/**
 * Privacy & PII Redaction Utilities for Audio Guardian
 * Ensures sensitive banking authentication tokens, identity numbers, and personal identifiers
 * are sanitized before UI rendering, telemetry logging, and Firestore persistence.
 */

/**
 * Mask middle digits of phone numbers: +91 98765 43210 -> +91 98*** **210
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  
  // Format: +91 XXXXX XXXXX or +91XXXXXXXXXX
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.replace(/[^\d+]/g, '');
    if (digits.length >= 13) {
      return `+91 ${digits.slice(3, 5)}*** **${digits.slice(-3)}`;
    }
  }

  // Generic 10 digit number
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length >= 10) {
    const start = digitsOnly.slice(0, 2);
    const end = digitsOnly.slice(-3);
    return `${start}*****${end}`;
  }

  return phone;
}

/**
 * Mask email address: user.name@domain.com -> u***e@domain.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `*@${domain}`;
  }
  const maskedUser = `${user[0]}${'*'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

/**
 * Automatically redact sensitive banking OTPs, PINs, Aadhaar, PAN, and Card numbers from speech text
 */
export function redactSensitiveTokens(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // 1. Redact 4 to 6 digit OTP / Verification codes following trigger keywords
  // e.g. "your OTP is 492019" -> "your OTP is [REDACTED OTP]"
  sanitized = sanitized.replace(
    /(\b(otp|code|verification\s*code|pin|mpin|cvv)\s*(is|:|was|-)?\s*)([0-9]{4,6})\b/gi,
    '$1[REDACTED TOKEN]'
  );

  // 2. Redact 16-digit credit / debit card numbers
  sanitized = sanitized.replace(
    /\b(?:\d[ -]*?){13,16}\b/g,
    (match) => {
      const cleanDigits = match.replace(/\D/g, '');
      if (cleanDigits.length === 16) {
        return `**** **** **** ${cleanDigits.slice(-4)}`;
      }
      return match;
    }
  );

  // 3. Redact 12-digit Indian Aadhaar numbers (XXXX-XXXX-1234)
  sanitized = sanitized.replace(
    /\b[2-9]{1}[0-9]{3}\s+[0-9]{4}\s+[0-9]{4}\b/g,
    'XXXX-XXXX-[AADHAAR]'
  );

  // 4. Redact 10-character Indian PAN Card format (ABCDE1234F)
  sanitized = sanitized.replace(
    /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    '[REDACTED PAN]'
  );

  return sanitized;
}
