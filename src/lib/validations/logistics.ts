import { z } from "zod";

export const vehicleTypeEnum = z.enum([
  "sedan",
  "suv",
  "tempo_traveller",
  "mini_bus",
  "bus",
  "two_wheeler",
  "other",
]);

export const parkingStatusEnum = z.enum([
  "reserved",
  "allocated",
  "arrived",
  "cancelled",
]);

export const tripStatusEnum = z.enum([
  "scheduled",
  "boarding",
  "in_transit",
  "completed",
  "cancelled",
]);

export const roomTypeEnum = z.enum([
  "standard",
  "deluxe",
  "suite",
  "villa",
  "dormitory",
]);

export const roomStatusEnum = z.enum([
  "available",
  "occupied",
  "blocked",
  "maintenance",
]);

export const roomAllocationStatusEnum = z.enum([
  "reserved",
  "checked_in",
  "checked_out",
  "cancelled",
]);

// 1. Parking Area Schema
export const parkingAreaSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid().optional().nullable(),
  venueId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "Parking area name is required."),
  locationDescription: z.string().optional().nullable(),
  totalCapacity: z.coerce.number().int().min(1, "Total capacity must be at least 1."),
  isAccessible: z.boolean().default(false),
  isValetAvailable: z.boolean().default(false),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

// 2. Parking Allocation Schema
export const parkingAllocationSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  parkingAreaId: z.string().uuid("Valid parking area required."),
  guestId: z.string().uuid().optional().nullable(),
  householdId: z.string().uuid().optional().nullable(),
  vehicleType: vehicleTypeEnum.default("sedan"),
  vehicleRegistration: z.string().optional().nullable(),
  driverName: z.string().optional().nullable(),
  driverPhone: z.string().optional().nullable(),
  slotNumber: z.string().optional().nullable(),
  status: parkingStatusEnum.default("allocated"),
  notes: z.string().optional().nullable(),
});

// 3. Transport Vehicle Schema
export const transportVehicleSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  vendorId: z.string().uuid().optional().nullable(),
  providerName: z.string().min(1, "Provider or fleet name is required."),
  vehicleType: vehicleTypeEnum.default("tempo_traveller"),
  registrationNumber: z.string().optional().nullable(),
  capacity: z.coerce.number().int().min(1, "Passenger capacity must be at least 1."),
  driverName: z.string().optional().nullable(),
  driverPhone: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

// 4. Transport Trip Schema
export const transportTripSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  vehicleId: z.string().uuid("Valid vehicle ID required."),
  eventId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Trip / Route title is required."),
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
  pickupPoint: z.string().optional().nullable(),
  scheduledPickupTime: z.string().min(1, "Scheduled pickup time is required."),
  estimatedArrivalTime: z.string().optional().nullable(),
  status: tripStatusEnum.default("scheduled"),
  notes: z.string().optional().nullable(),
});

// 5. Transport Passenger Assignment Schema
export const transportPassengerSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  tripId: z.string().uuid("Valid trip ID required."),
  guestId: z.string().uuid("Valid guest ID required."),
  passengerCount: z.coerce.number().int().min(1, "Passenger count must be at least 1.").default(1),
  pickupNotes: z.string().optional().nullable(),
});

// 6. Accommodation Property Schema
export const accommodationPropertySchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  name: z.string().min(1, "Property name is required."),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

// 7. Room Inventory Schema
export const roomInventorySchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  propertyId: z.string().uuid("Valid property ID required."),
  roomNumber: z.string().min(1, "Room number is required."),
  roomType: roomTypeEnum.default("deluxe"),
  floor: z.string().optional().nullable(),
  maxOccupancy: z.coerce.number().int().min(1, "Max occupancy must be at least 1.").default(2),
  status: roomStatusEnum.default("available"),
  notes: z.string().optional().nullable(),
});

// 8. Room Allocation Schema
export const roomAllocationSchema = z
  .object({
    weddingId: z.string().uuid("Valid wedding ID required."),
    roomId: z.string().uuid("Valid room ID required."),
    guestId: z.string().uuid().optional().nullable(),
    householdId: z.string().uuid().optional().nullable(),
    occupancyCount: z.coerce.number().int().min(1, "Occupancy must be at least 1.").default(1),
    checkInDate: z.string().min(1, "Check-in date is required."),
    checkOutDate: z.string().min(1, "Check-out date is required."),
    status: roomAllocationStatusEnum.default("reserved"),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) => new Date(data.checkOutDate) >= new Date(data.checkInDate),
    {
      message: "Check-out date must be on or after check-in date.",
      path: ["checkOutDate"],
    }
  );

export type ParkingAreaFormData = z.infer<typeof parkingAreaSchema>;
export type ParkingAllocationFormData = z.infer<typeof parkingAllocationSchema>;
export type TransportVehicleFormData = z.infer<typeof transportVehicleSchema>;
export type TransportTripFormData = z.infer<typeof transportTripSchema>;
export type TransportPassengerFormData = z.infer<typeof transportPassengerSchema>;
export type AccommodationPropertyFormData = z.infer<typeof accommodationPropertySchema>;
export type RoomInventoryFormData = z.infer<typeof roomInventorySchema>;
export type RoomAllocationFormData = z.infer<typeof roomAllocationSchema>;

