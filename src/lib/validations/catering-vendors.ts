import { z } from "zod";

export const vendorCategoryEnum = z.enum([
  "caterer",
  "decorator",
  "photographer",
  "videographer",
  "makeup",
  "dj",
  "priest",
  "florist",
  "transport",
  "venue",
  "other",
]);

export const vendorBookingStatusEnum = z.enum([
  "inquiry",
  "quoted",
  "booked",
  "completed",
  "cancelled",
]);

export const mealTypeEnum = z.enum(["breakfast", "lunch", "high_tea", "dinner"]);
export const serviceStyleEnum = z.enum([
  "buffet",
  "seated_thali",
  "cocktail",
  "food_stations",
]);

export const baseVendorSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  businessName: z.string().min(1, "Vendor / Business name is required."),
  category: vendorCategoryEnum.default("other"),
  contactName: z.string().min(1, "Contact person name is required."),
  phone: z.string().optional().nullable(),
  email: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
  bookingStatus: vendorBookingStatusEnum.default("inquiry"),
  quotedPrice: z.coerce.number().min(0, "Quoted price must be 0 or more.").default(0),
  agreedPrice: z.coerce.number().min(0, "Agreed price must be 0 or more.").default(0),
  advancePaid: z.coerce.number().min(0, "Advance paid must be 0 or more.").default(0),
  paymentDueDate: z.string().optional().nullable(),
  arrivalTime: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const vendorSchema = baseVendorSchema.refine(
  (data) => data.advancePaid <= data.agreedPrice || data.agreedPrice === 0,
  {
    message: "Advance paid cannot exceed agreed contract price.",
    path: ["advancePaid"],
  }
);

export const vendorUpdateSchema = baseVendorSchema.partial().extend({
  id: z.string().uuid("Valid vendor ID required."),
}).refine(
  (data) => {
    if (data.advancePaid !== undefined && data.agreedPrice !== undefined) {
      return data.advancePaid <= data.agreedPrice || data.agreedPrice === 0;
    }
    return true;
  },
  {
    message: "Advance paid cannot exceed agreed contract price.",
    path: ["advancePaid"],
  }
);

export const vendorAssignmentSchema = z.object({
  vendorId: z.string().uuid("Valid vendor ID required."),
  eventId: z.string().uuid("Valid event ID required."),
  serviceDescription: z.string().optional().nullable(),
  arrivalTime: z.string().optional().nullable(),
});

export const mealPlanSchema = z.object({
  eventId: z.string().uuid("Valid event ID required."),
  vendorId: z.string().uuid().optional().nullable(),
  mealType: mealTypeEnum.default("dinner"),
  serviceStyle: serviceStyleEnum.default("buffet"),
  menuDescription: z.string().optional().nullable(),
  plannedPerPlateCost: z.coerce.number().min(0, "Planned plate cost must be 0 or more.").default(0),
  bufferPercentage: z.coerce
    .number()
    .int()
    .min(0, "Buffer cannot be negative.")
    .max(50, "Safety buffer cannot exceed 50%.")
    .default(10),
  notes: z.string().optional().nullable(),
});

export const approveGuaranteeSchema = z.object({
  mealPlanId: z.string().uuid("Valid meal plan ID required."),
  approvedHeadcount: z.coerce.number().int().min(1, "Approved guarantee headcount must be at least 1."),
});

export type VendorFormData = z.infer<typeof vendorSchema>;
export type VendorUpdateFormData = z.infer<typeof vendorUpdateSchema>;
export type VendorAssignmentData = z.infer<typeof vendorAssignmentSchema>;
export type MealPlanFormData = z.infer<typeof mealPlanSchema>;
export type ApproveGuaranteeData = z.infer<typeof approveGuaranteeSchema>;
