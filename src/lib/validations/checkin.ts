import { z } from "zod";

export const passStatusEnum = z.enum(["active", "revoked", "expired"]);
export const checkinMethodEnum = z.enum(["qr_scan", "manual_lookup", "manual_override"]);

export const issueQrPassSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid("Valid event ID required."),
  guestId: z.string().uuid("Valid guest ID required."),
  permittedAttendeesCount: z.coerce.number().int().min(1, "Permitted attendees count must be at least 1.").default(1),
  expiresAt: z.string().optional().nullable(),
});

export const revokeQrPassSchema = z.object({
  passId: z.string().uuid("Valid pass ID required."),
  reason: z.string().min(1, "Revocation reason is required."),
});

export const scanCheckinSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid("Valid event ID required."),
  passCode: z.string().min(1, "Pass code is required."),
  gateId: z.string().uuid().optional().nullable(),
  admittedCount: z.coerce.number().int().min(1, "Admitted count must be at least 1.").default(1),
  operatorNotes: z.string().optional().nullable(),
});

export const manualCheckinSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid("Valid event ID required."),
  guestId: z.string().uuid("Valid guest ID required."),
  gateId: z.string().uuid().optional().nullable(),
  admittedCount: z.coerce.number().int().min(1, "Admitted count must be at least 1.").default(1),
  isOverride: z.boolean().default(false),
  overrideReason: z.string().optional().nullable(),
  operatorNotes: z.string().optional().nullable(),
}).refine(
  (data) => !data.isOverride || (data.overrideReason && data.overrideReason.trim().length > 0),
  {
    message: "An explicit override reason is required for manual overrides.",
    path: ["overrideReason"],
  }
);

export const checkinGateSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid("Valid event ID required."),
  name: z.string().min(1, "Gate name is required."),
  locationDescription: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type IssueQrPassData = z.infer<typeof issueQrPassSchema>;
export type RevokeQrPassData = z.infer<typeof revokeQrPassSchema>;
export type ScanCheckinData = z.infer<typeof scanCheckinSchema>;
export type ManualCheckinData = z.infer<typeof manualCheckinSchema>;
export type CheckinGateData = z.infer<typeof checkinGateSchema>;

