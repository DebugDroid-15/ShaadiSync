import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeCsvCell, sanitizePhoneNumber, sanitizeInteger } from "@/lib/security/sanitizer";
import { generateSecureToken, generateReadablePassCode, createPassSignature, verifyPassSignature } from "@/lib/security/tokens";

describe("Phase 10: Backend Security Enhancements Verification", () => {
  beforeEach(() => {
    resetRateLimit("test-client");
    resetRateLimit("test-gate");
  });

  describe("Sliding Window Rate Limiter", () => {
    it("allows requests under the configured threshold", () => {
      const config = { maxRequests: 5, windowMs: 10000 };
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit("test-client", config);
        expect(res.isAllowed).toBe(true);
        expect(res.remaining).toBe(4 - i);
      }
    });

    it("blocks requests that exceed the rate limit threshold", () => {
      const config = { maxRequests: 3, windowMs: 10000 };
      checkRateLimit("test-gate", config);
      checkRateLimit("test-gate", config);
      checkRateLimit("test-gate", config);

      const blockedRes = checkRateLimit("test-gate", config);
      expect(blockedRes.isAllowed).toBe(false);
      expect(blockedRes.remaining).toBe(0);
      expect(blockedRes.resetMs).toBeGreaterThan(0);
    });

    it("clears limits cleanly on explicit reset", () => {
      const config = { maxRequests: 2, windowMs: 10000 };
      checkRateLimit("test-client", config);
      checkRateLimit("test-client", config);
      expect(checkRateLimit("test-client", config).isAllowed).toBe(false);

      resetRateLimit("test-client");
      expect(checkRateLimit("test-client", config).isAllowed).toBe(true);
    });
  });

  describe("Input Sanitization & Anti-Injection Defenses", () => {
    it("neutralizes malicious HTML script and event handler tags from text", () => {
      const malicious = "<script>alert('pwned')</script>Hello Royal Family <iframe src='evil.com'></iframe><img src=x onerror='alert(1)'>";
      const clean = sanitizeText(malicious);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("alert");
      expect(clean).not.toContain("<iframe");
      expect(clean).toContain("Hello Royal Family");
    });

    it("escapes CSV injection characters to prevent DDE attacks", () => {
      expect(sanitizeCsvCell("=1+1")).toBe("'=1+1");
      expect(sanitizeCsvCell("+cmd|' /C calc'!A0")).toBe("'+cmd|' /C calc'!A0");
      expect(sanitizeCsvCell("-5")).toBe("'-5");
      expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
      expect(sanitizeCsvCell("\tmalicious")).toBe("'\tmalicious");
      expect(sanitizeCsvCell("Aarav Sharma")).toBe("Aarav Sharma");
      expect(sanitizeCsvCell(1500)).toBe("1500");
    });

    it("sanitizes Indian and international phone numbers defensively", () => {
      expect(sanitizePhoneNumber("+91 98765-43210")).toBe("+919876543210");
      expect(sanitizePhoneNumber("  (987) 654-3210  ")).toBe("9876543210");
      expect(sanitizePhoneNumber("invalid-letters")).toBeNull();
      expect(sanitizePhoneNumber("")).toBeNull();
      expect(sanitizePhoneNumber(null)).toBeNull();
    });

    it("clamps and safely sanitizes integer values against negative and NaN injections", () => {
      expect(sanitizeInteger("5", 1, 1, 20)).toBe(5);
      expect(sanitizeInteger("-10", 1, 1, 20)).toBe(1);
      expect(sanitizeInteger("1000", 1, 1, 50)).toBe(50);
      expect(sanitizeInteger("not-a-number", 1, 1, 50)).toBe(1);
      expect(sanitizeInteger(undefined, 1, 1, 50)).toBe(1);
    });
  });

  describe("Pass Token Cryptographic Verification & Signatures", () => {
    it("generates high-entropy unguessable tokens", () => {
      const token1 = generateSecureToken(24);
      const token2 = generateSecureToken(24);
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(48); // 24 bytes in hex is 48 chars
    });

    it("generates clean, human-readable pass codes with unambiguous characters", () => {
      const code = generateReadablePassCode("SS");
      expect(code).toMatch(/^SS-[A-Z0-9]{4}-\d{4}$/);
      expect(code).not.toContain("0"); // Ambiguous chars excluded
      expect(code).not.toContain("1");
      expect(code).not.toContain("I");
      expect(code).not.toContain("O");
    });

    it("correctly generates and cryptographically verifies HMAC signatures", () => {
      const passCode = "SS-UDAI-4892";
      const weddingId = "wed-aarav-diya";
      const eventId = "fn-02-sangeet";

      const signature = createPassSignature(passCode, weddingId, eventId);
      expect(signature.length).toBe(16);

      // Verify matching signature
      const isValid = verifyPassSignature(passCode, weddingId, eventId, signature);
      expect(isValid).toBe(true);

      // Tampered passCode must fail
      const isTamperedCode = verifyPassSignature("SS-UDAI-9999", weddingId, eventId, signature);
      expect(isTamperedCode).toBe(false);

      // Tampered eventId must fail
      const isTamperedEvent = verifyPassSignature(passCode, weddingId, "fn-03-reception", signature);
      expect(isTamperedEvent).toBe(false);

      // Forged signature must fail
      const isForgedSig = verifyPassSignature(passCode, weddingId, eventId, "0000000000000000");
      expect(isForgedSig).toBe(false);
    });
  });
});

