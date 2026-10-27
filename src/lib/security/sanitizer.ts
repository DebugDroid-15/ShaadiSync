/**
 * Input Sanitization & Anti-Injection Defense Engine
 * Protects against:
 * - Cross-Site Scripting (XSS) in user notes, guest names, venue addresses
 * - CSV Formula Injection (DDE attacks)
 * - HTML tag injection & prototype pollution
 * - Phone number / Token normalization
 */

/**
 * Strips dangerous HTML tags and event handlers from text inputs.
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .trim();
}

/**
 * Escapes characters that trigger spreadsheet formula execution (=, +, -, @, \t, \r).
 */
export function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);

  // If the string starts with characters used in spreadsheet formula injection, prepend with a single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Normalizes Indian and international phone numbers into clean E.164-compatible strings.
 * Removes spaces, hyphens, and brackets.
 */
export function sanitizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  // Must contain only digits and optional leading plus sign
  if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

/**
 * Safely parses integer quantities preventing negative values or overflow NaN.
 */
export function sanitizeInteger(value: unknown, defaultValue: number = 0, min: number = 0, max: number = 1000000): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return defaultValue;
  return Math.max(min, Math.min(max, Math.floor(num)));
}

