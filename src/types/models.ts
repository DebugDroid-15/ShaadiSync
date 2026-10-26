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

export type ExpenseCategory =
  | "venue"
  | "catering"
  | "decor"
  | "photography"
  | "entertainment"
  | "attire_makeup"
  | "transport_logistics"
  | "invitations_gifts"
  | "priest_rituals"
  | "miscellaneous";

export type PaymentMode =
  | "bank_transfer"
  | "upi"
  | "cash"
  | "cheque"
  | "card"
  | "other";

export type PaymentType =
  | "advance"
  | "milestone"
  | "final"
  | "refund"
  | "correction";

export interface BudgetAllocation {
  id: string;
  weddingId: string;
  eventId?: string | null;
  eventName?: string | null;
  category: ExpenseCategory;
  allocatedAmount: number;
  notes?: string | null;
}

export interface Expense {
  id: string;
  weddingId: string;
  eventId?: string | null;
  eventName?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  category: ExpenseCategory;
  title: string;
  description?: string | null;
  estimatedAmount: number;
  actualAmount: number;
  isPaid: boolean;
  invoiceNumber?: string | null;
  dueDate?: string | null;
  paidAmount?: number;
  balanceDue?: number;
}

export interface PaymentRecord {
  id: string;
  weddingId: string;
  vendorId?: string | null;
  vendorName?: string | null;
  expenseId?: string | null;
  expenseTitle?: string | null;
  amount: number;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  paymentDate: string;
  referenceNumber?: string | null;
  paidByName?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface BudgetCategoryItem {
  category: ExpenseCategory;
  name: string;
  allocated: number;
  actual: number;
  paid: number;
  due: number;
  variance: number;
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

// =====================================================================
// Logistics: Parking, Transport & Accommodation Types
// =====================================================================

export type VehicleType =
  | "sedan"
  | "suv"
  | "tempo_traveller"
  | "mini_bus"
  | "bus"
  | "two_wheeler"
  | "other";

export type ParkingStatus = "reserved" | "allocated" | "arrived" | "cancelled";

export interface ParkingArea {
  id: string;
  weddingId: string;
  eventId?: string | null;
  eventName?: string | null;
  name: string;
  locationDescription?: string | null;
  totalCapacity: number;
  allocatedCount?: number;
  remainingCapacity?: number;
  isAccessible: boolean;
  isValetAvailable: boolean;
  notes?: string | null;
  isActive: boolean;
}

export interface ParkingAllocation {
  id: string;
  weddingId: string;
  parkingAreaId: string;
  parkingAreaName?: string;
  guestId?: string | null;
  guestName?: string | null;
  householdId?: string | null;
  householdName?: string | null;
  vehicleType: VehicleType;
  vehicleRegistration?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  slotNumber?: string | null;
  status: ParkingStatus;
  notes?: string | null;
}

export type TripStatus = "scheduled" | "boarding" | "in_transit" | "completed" | "cancelled";

export interface TransportVehicle {
  id: string;
  weddingId: string;
  vendorId?: string | null;
  providerName: string;
  vehicleType: VehicleType;
  registrationNumber?: string | null;
  capacity: number;
  driverName?: string | null;
  driverPhone?: string | null;
  isActive: boolean;
  notes?: string | null;
}

export interface TransportTrip {
  id: string;
  weddingId: string;
  vehicleId: string;
  vehicleProviderName?: string;
  vehicleType?: VehicleType;
  totalCapacity?: number;
  eventId?: string | null;
  eventName?: string | null;
  title: string;
  origin: string;
  destination: string;
  pickupPoint?: string | null;
  scheduledPickupTime: string;
  estimatedArrivalTime?: string | null;
  status: TripStatus;
  passengerCount?: number;
  availableSeats?: number;
  notes?: string | null;
}

export interface TransportPassenger {
  id: string;
  tripId: string;
  guestId: string;
  guestName?: string;
  householdName?: string;
  passengerCount: number;
  pickupNotes?: string | null;
}

export type RoomType = "standard" | "deluxe" | "suite" | "villa" | "dormitory";
export type RoomStatus = "available" | "occupied" | "blocked" | "maintenance";
export type RoomAllocationStatus = "reserved" | "checked_in" | "checked_out" | "cancelled";

export interface AccommodationProperty {
  id: string;
  weddingId: string;
  name: string;
  address?: string | null;
  city?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  isActive: boolean;
  notes?: string | null;
  totalRooms?: number;
  occupiedRooms?: number;
  vacantRooms?: number;
}

export interface RoomInventory {
  id: string;
  weddingId: string;
  propertyId: string;
  propertyName?: string;
  roomNumber: string;
  roomType: RoomType;
  floor?: string | null;
  maxOccupancy: number;
  status: RoomStatus;
  notes?: string | null;
  currentAllocation?: RoomAllocation | null;
}

export interface RoomAllocation {
  id: string;
  weddingId: string;
  roomId: string;
  roomNumber?: string;
  propertyName?: string;
  guestId?: string | null;
  guestName?: string | null;
  householdId?: string | null;
  householdName?: string | null;
  occupancyCount: number;
  checkInDate: string;
  checkOutDate: string;
  status: RoomAllocationStatus;
  notes?: string | null;
}

export interface LogisticsSummary {
  parking: {
    totalCapacity: number;
    allocatedSpaces: number;
    remainingCapacity: number;
    utilisationPercentage: number;
  };
  transport: {
    activeTrips: number;
    totalSeatCapacity: number;
    assignedPassengers: number;
    availableSeats: number;
  };
  accommodation: {
    totalRooms: number;
    occupiedRooms: number;
    vacantRooms: number;
    occupancyRate: number;
    upcomingArrivals: number;
    upcomingDepartures: number;
  };
}
