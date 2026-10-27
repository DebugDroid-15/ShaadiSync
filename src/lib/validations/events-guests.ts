import { z } from "zod";

export const eventTypeSchema = z.enum([
  "roka",
  "haldi",
  "mehendi",
  "sangeet",
  "ceremony",
  "reception",
  "custom",
]);

export const guestSideSchema = z.enum(["bride", "groom", "mutual"]);
export const guestCategorySchema = z.enum(["family", "close_friend", "colleague", "vip"]);
export const ageGroupSchema = z.enum(["adult", "child"]);
export const dietaryPrefSchema = z.enum(["veg", "jain", "non_veg", "vegan"]);

// Function / Event creation & update schema
export const eventSchema = z.object({
  weddingId: z.string().min(1, "Valid wedding ID is required."),
  venueId: z.string().optional().nullable(),
  name: z.string().min(2, "Function name must be at least 2 characters."),
  eventType: eventTypeSchema,
  startTime: z.string().datetime("Valid ISO start datetime is required."),
  endTime: z.string().datetime("Valid ISO end datetime is required."),
  guestCapacity: z.coerce.number().int().positive("Capacity must be a positive integer."),
  dressCode: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
}).refine((data) => new Date(data.endTime) >= new Date(data.startTime), {
  message: "End time cannot precede start time.",
  path: ["endTime"],
});

// Household schema
export const householdSchema = z.object({
  weddingId: z.string().min(1, "Valid wedding ID is required."),
  familyName: z.string().min(2, "Family name must be at least 2 characters."),
  primaryContactName: z.string().min(2, "Primary contact name is required."),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email format.").optional().nullable(),
  city: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Guest schema
export const guestSchema = z.object({
  weddingId: z.string().min(1, "Valid wedding ID is required."),
  householdId: z.string().optional().nullable(),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  side: guestSideSchema.default("mutual"),
  category: guestCategorySchema.default("family"),
  ageGroup: ageGroupSchema.default("adult"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email format.").optional().nullable(),
  dietaryPref: dietaryPrefSchema.default("veg"),
  allergiesNotes: z.string().optional().nullable(),
  isVip: z.boolean().default(false),
  invitedEventIds: z.array(z.string().uuid()).default([]),
});

// CSV Row Schema for Import Validation
export const csvGuestRowSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional().default(""),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  side: guestSideSchema.catch("mutual"),
  category: guestCategorySchema.catch("family"),
  ageGroup: ageGroupSchema.catch("adult"),
  dietaryPref: dietaryPrefSchema.catch("veg"),
  allergies: z.string().optional().default(""),
  isVip: z.preprocess((val) => {
    if (typeof val === "string") {
      const v = val.toLowerCase().trim();
      return v === "true" || v === "yes" || v === "1" || v === "vip";
    }
    return Boolean(val);
  }, z.boolean().default(false)),
  familyName: z.string().optional().default(""),
});

export type CsvGuestRow = z.infer<typeof csvGuestRowSchema>;

export interface CsvImportError {
  rowNumber: number;
  rawRow: Record<string, string>;
  errors: string[];
}

export interface CsvImportResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errorCount: number;
  errors: CsvImportError[];
  validRows: CsvGuestRow[];
}
