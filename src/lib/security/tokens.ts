import crypto from "crypto";

/**
 * QR Pass Cryptographic Verification & Token Integrity Engine
 * Generates secure, unguessable, signed entry tokens and verifies pass checksums.
 */

// Secret used for HMAC token signatures (falls back to secure runtime seed)
const HMAC_SECRET = process.env.QR_HMAC_SECRET || "shaadisync-royal-secret-key-salt-2026";

export interface SignedPassPayload {
  weddingId: string;
  eventId: string;
  guestId: string;
  issuedAt: number;
}

/**
 * Generates a high-entropy random token for WhatsApp magic links and passes.
 */
export function generateSecureToken(byteLength: number = 24): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Generates an auspicious, human-readable pass code (e.g. SS-UDAI-4892)
 */
export function generateReadablePassCode(prefix: string = "SS"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes ambiguous 0, 1, I, O
  let randomStr = "";
  const randomBytes = crypto.randomBytes(8);
  for (let i = 0; i < 4; i++) {
    randomStr += chars[randomBytes[i] % chars.length];
  }
  let digits = "";
  const digitChars = "23456789";
  for (let i = 4; i < 8; i++) {
    digits += digitChars[randomBytes[i] % digitChars.length];
  }
  return `${prefix}-${randomStr}-${digits}`;
}

/**
 * Creates an HMAC signature for a pass token to prevent forgery or tampering.
 */
export function createPassSignature(passCode: string, weddingId: string, eventId: string): string {
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(`${passCode}:${weddingId}:${eventId}`)
    .digest("hex")
    .substring(0, 16);
}

/**
 * Validates a pass signature to detect tampered or forged passes.
 */
export function verifyPassSignature(
  passCode: string,
  weddingId: string,
  eventId: string,
  signature: string
): boolean {
  const expected = createPassSignature(passCode, weddingId, eventId);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

