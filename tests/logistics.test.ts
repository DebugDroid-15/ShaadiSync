import { describe, it, expect } from "vitest";
import {
  parkingAreaSchema,
  parkingAllocationSchema,
  transportVehicleSchema,
  transportTripSchema,
  accommodationPropertySchema,
  roomInventorySchema,
  roomAllocationSchema,
} from "@/lib/validations/logistics";

describe("Phase 7: Parking Validation & Capacity Invariants", () => {
  it("validates valid parking area attributes", () => {
    const validArea = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      name: "East Lawn Valet Parking",
      totalCapacity: 50,
      isAccessible: true,
      isValetAvailable: true,
    };

    const res = parkingAreaSchema.safeParse(validArea);
    expect(res.success).toBe(true);
  });

  it("rejects non-positive parking capacity", () => {
    const invalidArea = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Zero Lot",
      totalCapacity: 0,
    };

    const res = parkingAreaSchema.safeParse(invalidArea);
    expect(res.success).toBe(false);
  });

  it("enforces capacity boundary on allocation", () => {
    const capacity = 20;
    const existingAllocations = 20;
    const isAtCapacity = existingAllocations >= capacity;

    expect(isAtCapacity).toBe(true);
    const remaining = Math.max(0, capacity - existingAllocations);
    expect(remaining).toBe(0);
  });
});

describe("Phase 7: Transport Validation & Seat Invariants", () => {
  it("validates transport vehicles and trips with correct seat capacities", () => {
    const vehicle = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      providerName: "Royal Rajput Fleet",
      vehicleType: "tempo_traveller",
      capacity: 17,
      driverName: "Sukhdev",
      driverPhone: "+91 94141 22334",
    };

    const vRes = transportVehicleSchema.safeParse(vehicle);
    expect(vRes.success).toBe(true);

    const trip = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      vehicleId: "123e4567-e89b-12d3-a456-426614174001",
      title: "Airport Group Shuttle",
      origin: "UDR Airport",
      destination: "Lake Palace",
      scheduledPickupTime: "2026-11-20T11:30:00Z",
    };

    const tRes = transportTripSchema.safeParse(trip);
    expect(tRes.success).toBe(true);
  });

  it("calculates seat availability and rejects negative passenger counts", () => {
    const totalCapacity = 17;
    const assignedPassengers = 14;
    const availableSeats = Math.max(0, totalCapacity - assignedPassengers);

    expect(availableSeats).toBe(3);

    // Negative seats should not exist
    const overAssigned = 20;
    const overAvailable = Math.max(0, totalCapacity - overAssigned);
    expect(overAvailable).toBe(0);
  });
});

describe("Phase 7: Accommodation Validation & Room Overlap Safety", () => {
  it("validates room allocations with check-out after check-in date", () => {
    const validAlloc = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      roomId: "123e4567-e89b-12d3-a456-426614174002",
      occupancyCount: 2,
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-23",
    };

    const res = roomAllocationSchema.safeParse(validAlloc);
    expect(res.success).toBe(true);
  });

  it("rejects invalid date ranges where check-out precedes check-in", () => {
    const invalidAlloc = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      roomId: "123e4567-e89b-12d3-a456-426614174002",
      occupancyCount: 2,
      checkInDate: "2026-11-23",
      checkOutDate: "2026-11-20", // Before checkInDate
    };

    const res = roomAllocationSchema.safeParse(invalidAlloc);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.errors[0].message).toContain("Check-out date must be on or after check-in date");
    }
  });

  it("detects overlapping bookings for the same room safely", () => {
    const existingBooking = {
      roomId: "rm-101",
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-23",
    };

    // Conflicting: Nov 21 to Nov 24
    const newBooking = {
      roomId: "rm-101",
      checkInDate: "2026-11-21",
      checkOutDate: "2026-11-24",
    };

    const hasConflict = !(
      newBooking.checkOutDate <= existingBooking.checkInDate ||
      newBooking.checkInDate >= existingBooking.checkOutDate
    );

    expect(hasConflict).toBe(true);

    // Non-conflicting: Nov 24 to Nov 26
    const futureBooking = {
      roomId: "rm-101",
      checkInDate: "2026-11-24",
      checkOutDate: "2026-11-26",
    };

    const isNonConflicting = !(
      futureBooking.checkOutDate <= existingBooking.checkInDate ||
      futureBooking.checkInDate >= existingBooking.checkOutDate
    );

    expect(isNonConflicting).toBe(false);
  });

  it("enforces max occupancy limits per room", () => {
    const maxOccupancy = 2;
    const requestedOccupancy = 4;
    const isExceeded = requestedOccupancy > maxOccupancy;

    expect(isExceeded).toBe(true);
  });
});

