/**
 * Privacy & PII Redaction Utilities for Audio Guardian Serverless Backend
 */

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.replace(/[^\d+]/g, '');
    if (digits.length >= 13) {
      return `+91 ${digits.slice(3, 5)}*** **${digits.slice(-3)}`;
    }
  }

  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length >= 10) {
    const start = digitsOnly.slice(0, 2);
    const end = digitsOnly.slice(-3);
    return `${start}*****${end}`;
  }

  return phone;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `*@${domain}`;
  }
  const maskedUser = `${user[0]}${'*'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

export function redactSensitiveTokens(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Redact OTP / Verification codes following trigger keywords
  sanitized = sanitized.replace(
    /(\b(otp|code|verification\s*code|pin|mpin|cvv)\s*(is|:|was|-)?\s*)([0-9]{4,6})\b/gi,
    '$1[REDACTED TOKEN]'
  );

  // Redact 16-digit card numbers
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

  // Redact Aadhaar format
  sanitized = sanitized.replace(
    /\b[2-9]{1}[0-9]{3}\s+[0-9]{4}\s+[0-9]{4}\b/g,
    'XXXX-XXXX-[AADHAAR]'
  );

  // Redact PAN format
  sanitized = sanitized.replace(
    /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    '[REDACTED PAN]'
  );

  return sanitized;
}
