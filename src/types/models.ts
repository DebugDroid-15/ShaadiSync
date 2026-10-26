export type WeddingStatus = "planning" | "active" | "completed" | "archived";

export interface Wedding {
  id: string;
  organisationId: string;
  title: string;
  slug: string;
  coupleBrideName: string;
  coupleGroomName: string;
  startDate: string;
  endDate: string;
  primaryCity: string;
  status: WeddingStatus;
  totalBudget: number;
  totalExpenses: number;
  totalGuests: number;
  totalFunctions: number;
}

export type EventType = "roka" | "haldi" | "mehendi" | "sangeet" | "ceremony" | "reception" | "custom";

export interface WeddingFunction {
  id: string;
  weddingId: string;
  name: string;
  eventType: EventType;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  guestCapacity: number;
  dressCode?: string;
  description?: string;
  totalInvited: number;
  confirmedRsvp: number;
  declinedRsvp: number;
  pendingRsvp: number;
}

export type GuestSide = "bride" | "groom" | "mutual";
export type GuestCategory = "family" | "close_friend" | "colleague" | "vip";
export type AgeGroup = "adult" | "child";
export type DietaryPreference = "veg" | "jain" | "non_veg" | "vegan";

export interface Guest {
  id: string;
  weddingId: string;
  householdId?: string;
  firstName: string;
  lastName: string;
  side: GuestSide;
  category: GuestCategory;
  ageGroup: AgeGroup;
  phone: string;
  email: string;
  dietaryPreference: DietaryPreference;
  allergies?: string;
  isVip: boolean;
  invitationToken: string;
  invitedFunctionIds: string[];
}

export interface CateringPlan {
  id: string;
  functionId: string;
  functionName: string;
  mealType: "breakfast" | "lunch" | "high_tea" | "dinner";
  serviceStyle?: "buffet" | "seated_thali" | "cocktail" | "food_stations";
  catererName: string;
  vendorId?: string;
  perPlateEstimate: number;
  totalInvited: number;
  confirmedRsvp: number;
  pendingRsvp?: number;
  bufferPercentage: number;
  proposedHeadcount?: number;
  guaranteedHeadcount: number;
  isGuaranteeApproved: boolean;
  approvedGuaranteeHeadcount?: number | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  estimatedTotalCost: number;
  notes?: string | null;
}

export type VendorCategory =
  | "caterer"
  | "decorator"
  | "photographer"
  | "videographer"
  | "makeup"
  | "dj"
  | "priest"
  | "florist"
  | "transport"
  | "venue"
  | "other";

export type VendorBookingStatus =
  | "inquiry"
  | "quoted"
  | "booked"
  | "completed"
  | "cancelled";

export interface Vendor {
  id: string;
  weddingId: string;
  businessName: string;
  category: VendorCategory;
  contactName: string;
  phone: string;
  email: string;
  bookingStatus: VendorBookingStatus;
  quotedPrice: number;
  agreedPrice: number;
  advancePaid: number;
  balanceDue: number;
  paymentDueDate?: string | null;
  arrivalTime?: string | null;
  notes?: string | null;
  assignedEvents?: Array<{
    eventId: string;
    eventName: string;
    serviceDescription?: string;
    arrivalTime?: string;
  }>;
}

export interface BudgetCategoryItem {
  name: string;
  allocated: number;
  actual: number;
  paid: number;
  due: number;
}

export interface BudgetSummary {
  totalBudget: number;
  totalActual: number;
  advancePaid: number;
  balanceDue: number;
  variance: number;
  categories: BudgetCategoryItem[];
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface TaskItem {
  id: string;
  weddingId: string;
  title: string;
  functionId: string | null;
  assigneeName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}
