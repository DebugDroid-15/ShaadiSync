import { z } from "zod";
import { dietaryPrefSchema } from "./events-guests";

export const rsvpStatusEnum = z.enum(["attending", "declined", "tentative"]);

export const singleEventRsvpSchema = z.object({
  eventInvitationId: z.string().min(1, "Valid invitation ID required."),
  status: rsvpStatusEnum,
  adultCount: z.coerce.number().int().min(0, "Adult count must be 0 or more.").default(1),
  childCount: z.coerce.number().int().min(0, "Child count must be 0 or more.").default(0),
  dietaryPref: dietaryPrefSchema.default("veg"),
  dietaryNotes: z.string().optional().nullable(),
  accompanyingNames: z.string().optional().nullable(),
});

export const submitRsvpFormSchema = z.object({
  token: z.string().min(5, "Invitation token is required."),
  responses: z.array(singleEventRsvpSchema).min(1, "At least one ceremony response is required."),
  generalNotes: z.string().optional().nullable(),
});

export type SingleEventRsvp = z.infer<typeof singleEventRsvpSchema>;
export type SubmitRsvpForm = z.infer<typeof submitRsvpFormSchema>;
