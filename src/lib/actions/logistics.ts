"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  parkingAreaSchema,
  parkingAllocationSchema,
  transportVehicleSchema,
  transportTripSchema,
  transportPassengerSchema,
  accommodationPropertySchema,
  roomInventorySchema,
  roomAllocationSchema,
} from "@/lib/validations/logistics";
import {
  MOCK_PARKING_AREAS,
  MOCK_PARKING_ALLOCATIONS,
  MOCK_TRANSPORT_VEHICLES,
  MOCK_TRANSPORT_TRIPS,
  MOCK_ACCOMMODATION_PROPERTIES,
  MOCK_ROOM_INVENTORY,
  MOCK_ROOM_ALLOCATIONS,
  MOCK_LOGISTICS_SUMMARY,
} from "@/lib/mock-data";
import {
  ParkingArea,
  ParkingAllocation,
  TransportVehicle,
  TransportTrip,
  TransportPassenger,
  AccommodationProperty,
  RoomInventory,
  RoomAllocation,
  LogisticsSummary,
} from "@/types/models";

export type LogisticsActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// =====================================================================
// 1. OVERALL LOGISTICS SUMMARY
// =====================================================================
export async function getLogisticsSummaryAction(
  weddingId: string
): Promise<LogisticsActionResult<LogisticsSummary>> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: MOCK_LOGISTICS_SUMMARY };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // 1. Parking Areas & Allocations
  const { data: parkingAreas } = await (supabase.from("parking_areas") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ total_capacity: number }> | null }> };
  })
    .select("total_capacity")
    .eq("wedding_id", weddingId);

  const { data: parkingAllocations } = await (supabase.from("parking_allocations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ status: string }> | null }> };
  })
    .select("status")
    .eq("wedding_id", weddingId);

  const totalParkingCap = parkingAreas?.reduce((acc, p) => acc + (p.total_capacity || 0), 0) || 0;
  const activeParkingAlloc = parkingAllocations?.filter((a) => a.status !== "cancelled").length || 0;
  const remainingParking = Math.max(0, totalParkingCap - activeParkingAlloc);
  const parkingUtil = totalParkingCap > 0 ? Math.round((activeParkingAlloc / totalParkingCap) * 100) : 0;

  // 2. Transport Trips & Vehicles
  const { data: trips } = await (supabase.from("transport_trips") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ id: string; status: string; vehicle: { capacity: number } }> | null }> };
  })
    .select("id, status, vehicle:transport_vehicles(capacity)")
    .eq("wedding_id", weddingId);

  const { data: passengers } = await (supabase.from("transport_passengers") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ passenger_count: number }> | null }> };
  })
    .select("passenger_count")
    .eq("wedding_id", weddingId);

  const activeTripsCount = trips?.filter((t) => t.status !== "cancelled" && t.status !== "completed").length || 0;
  const totalSeatCap = trips?.reduce((acc, t) => acc + (t.vehicle?.capacity || 0), 0) || 0;
  const totalPassengers = passengers?.reduce((acc, p) => acc + (p.passenger_count || 1), 0) || 0;
  const availableSeats = Math.max(0, totalSeatCap - totalPassengers);

  // 3. Accommodation Properties & Rooms
  const { data: rooms } = await (supabase.from("rooms") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ id: string; status: string }> | null }> };
  })
    .select("id, status")
    .eq("wedding_id", weddingId);

  const { data: roomAllocations } = await (supabase.from("room_allocations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ status: string; check_in_date: string; check_out_date: string }> | null }> };
  })
    .select("status, check_in_date, check_out_date")
    .eq("wedding_id", weddingId);

  const totalRoomsCount = rooms?.length || 0;
  const occupiedRoomsCount = rooms?.filter((r) => r.status === "occupied").length || 0;
  const vacantRoomsCount = Math.max(0, totalRoomsCount - occupiedRoomsCount);
  const occupancyRate = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingArrivals = roomAllocations?.filter((a) => a.check_in_date >= todayStr && a.status === "reserved").length || 0;
  const upcomingDepartures = roomAllocations?.filter((a) => a.check_out_date === todayStr && a.status === "checked_in").length || 0;

  return {
    success: true,
    data: {
      parking: {
        totalCapacity: totalParkingCap,
        allocatedSpaces: activeParkingAlloc,
        remainingCapacity: remainingParking,
        utilisationPercentage: parkingUtil,
      },
      transport: {
        activeTrips: activeTripsCount,
        totalSeatCapacity: totalSeatCap,
        assignedPassengers: totalPassengers,
        availableSeats,
      },
      accommodation: {
        totalRooms: totalRoomsCount,
        occupiedRooms: occupiedRoomsCount,
        vacantRooms: vacantRoomsCount,
        occupancyRate,
        upcomingArrivals,
        upcomingDepartures,
      },
    },
  };
}

// =====================================================================
// 2. PARKING OPERATIONS
// =====================================================================
export async function getParkingAreasAction(
  weddingId: string
): Promise<LogisticsActionResult<ParkingArea[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_PARKING_AREAS.filter(
      (p) => p.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("parking_areas") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, event:events(name)")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };

  interface RawParkingAreaRow {
    id: string;
    wedding_id: string;
    event_id: string | null;
    venue_id: string | null;
    name: string;
    location_description: string | null;
    total_capacity: number;
    is_accessible: boolean;
    is_valet_available: boolean;
    notes: string | null;
    is_active: boolean;
    event?: { name: string } | null;
  }

  const rows = (data as RawParkingAreaRow[]) || [];
  const mapped: ParkingArea[] = rows.map((r) => ({
    id: r.id,
    weddingId: r.wedding_id,
    eventId: r.event_id,
    eventName: r.event?.name || null,
    name: r.name,
    locationDescription: r.location_description,
    totalCapacity: r.total_capacity,
    isAccessible: r.is_accessible,
    isValetAvailable: r.is_valet_available,
    notes: r.notes,
    isActive: r.is_active,
  }));

  return { success: true, data: mapped };
}

export async function createParkingAreaAction(formData: FormData): Promise<LogisticsActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    eventId: (formData.get("eventId") as string) || null,
    venueId: (formData.get("venueId") as string) || null,
    name: formData.get("name") as string,
    locationDescription: (formData.get("locationDescription") as string) || null,
    totalCapacity: Number(formData.get("totalCapacity") || 20),
    isAccessible: formData.get("isAccessible") === "true",
    isValetAvailable: formData.get("isValetAvailable") === "true",
    notes: (formData.get("notes") as string) || null,
    isActive: true,
  };

  const parseResult = parkingAreaSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const newArea: ParkingArea = {
      id: `mock-pa-${Date.now()}`,
      weddingId: validated.weddingId,
      eventId: validated.eventId,
      name: validated.name,
      locationDescription: validated.locationDescription,
      totalCapacity: validated.totalCapacity,
      allocatedCount: 0,
      remainingCapacity: validated.totalCapacity,
      isAccessible: validated.isAccessible,
      isValetAvailable: validated.isValetAvailable,
      notes: validated.notes,
      isActive: true,
    };
    return { success: true, data: newArea };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("parking_areas") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      event_id: validated.eventId,
      venue_id: validated.venueId,
      name: validated.name,
      location_description: validated.locationDescription,
      total_capacity: validated.totalCapacity,
      is_accessible: validated.isAccessible,
      is_valet_available: validated.isValetAvailable,
      notes: validated.notes,
      is_active: validated.isActive,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/logistics");
  return { success: true, data };
}

export async function getParkingAllocationsAction(
  weddingId: string
): Promise<LogisticsActionResult<ParkingAllocation[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_PARKING_ALLOCATIONS.filter(
      (p) => p.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("parking_allocations") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, parking_area:parking_areas(name), guest:guests(first_name, last_name), household:households(name)")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  interface RawParkingAllocRow {
    id: string;
    wedding_id: string;
    parking_area_id: string;
    guest_id: string | null;
    household_id: string | null;
    vehicle_type: ParkingAllocation["vehicleType"];
    vehicle_registration: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    slot_number: string | null;
    status: ParkingAllocation["status"];
    notes: string | null;
    parking_area?: { name: string } | null;
    guest?: { first_name: string; last_name: string } | null;
    household?: { name: string } | null;
  }

  const rows = (data as RawParkingAllocRow[]) || [];
  const mapped: ParkingAllocation[] = rows.map((r) => ({
    id: r.id,
    weddingId: r.wedding_id,
    parkingAreaId: r.parking_area_id,
    parkingAreaName: r.parking_area?.name || undefined,
    guestId: r.guest_id,
    guestName: r.guest ? `${r.guest.first_name} ${r.guest.last_name}` : undefined,
    householdId: r.household_id,
    householdName: r.household?.name || undefined,
    vehicleType: r.vehicle_type,
    vehicleRegistration: r.vehicle_registration,
    driverName: r.driver_name,
    driverPhone: r.driver_phone,
    slotNumber: r.slot_number,
    status: r.status,
    notes: r.notes,
  }));

  return { success: true, data: mapped };
}

export async function createParkingAllocationAction(
  formData: FormData
): Promise<LogisticsActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    parkingAreaId: formData.get("parkingAreaId") as string,
    guestId: (formData.get("guestId") as string) || null,
    householdId: (formData.get("householdId") as string) || null,
    vehicleType: (formData.get("vehicleType") as string) || "sedan",
    vehicleRegistration: (formData.get("vehicleRegistration") as string) || null,
    driverName: (formData.get("driverName") as string) || null,
    driverPhone: (formData.get("driverPhone") as string) || null,
    slotNumber: (formData.get("slotNumber") as string) || null,
    status: (formData.get("status") as string) || "allocated",
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = parkingAllocationSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  // Capacity verification
  if (!isSupabaseConfigured()) {
    const area = MOCK_PARKING_AREAS.find((a) => a.id === validated.parkingAreaId);
    if (area && area.remainingCapacity !== undefined && area.remainingCapacity <= 0) {
      return { success: false, error: `Parking facility "${area.name}" is already at full capacity (${area.totalCapacity} slots).` };
    }

    const newAlloc: ParkingAllocation = {
      id: `mock-palloc-${Date.now()}`,
      weddingId: validated.weddingId,
      parkingAreaId: validated.parkingAreaId,
      parkingAreaName: area?.name || "East Lawn Parking",
      guestId: validated.guestId,
      householdId: validated.householdId,
      vehicleType: validated.vehicleType,
      vehicleRegistration: validated.vehicleRegistration,
      driverName: validated.driverName,
      driverPhone: validated.driverPhone,
      slotNumber: validated.slotNumber,
      status: validated.status,
      notes: validated.notes,
    };
    return { success: true, data: newAlloc };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // Check parking area capacity
  const { data: areaData } = await (supabase.from("parking_areas") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { total_capacity: number; name: string } | null }> } };
  })
    .select("total_capacity, name")
    .eq("id", validated.parkingAreaId)
    .single();

  if (areaData) {
    const { data: existingAllocs } = await (supabase.from("parking_allocations") as unknown as {
      select: (q: string) => { eq: (col: string, val: string) => { neq: (col: string, val: string) => Promise<{ data: Array<{ id: string }> | null }> } };
    })
      .select("id")
      .eq("parking_area_id", validated.parkingAreaId)
      .neq("status", "cancelled");

    if (existingAllocs && existingAllocs.length >= areaData.total_capacity) {
      return { success: false, error: `Parking facility "${areaData.name}" is at maximum capacity (${areaData.total_capacity}).` };
    }
  }

  const { data, error } = await (supabase.from("parking_allocations") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      parking_area_id: validated.parkingAreaId,
      guest_id: validated.guestId,
      household_id: validated.householdId,
      vehicle_type: validated.vehicleType,
      vehicle_registration: validated.vehicleRegistration,
      driver_name: validated.driverName,
      driver_phone: validated.driverPhone,
      slot_number: validated.slotNumber,
      status: validated.status,
      notes: validated.notes,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/logistics");
  return { success: true, data };
}

// =====================================================================
// 3. TRANSPORT OPERATIONS
// =====================================================================
export async function getTransportTripsAction(
  weddingId: string
): Promise<LogisticsActionResult<TransportTrip[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_TRANSPORT_TRIPS.filter(
      (t) => t.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("transport_trips") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, vehicle:transport_vehicles(provider_name, vehicle_type, capacity), event:events(name), transport_passengers(passenger_count)")
    .eq("wedding_id", weddingId)
    .order("scheduled_pickup_time", { ascending: true });

  if (error) return { success: false, error: error.message };

  interface RawTripRow {
    id: string;
    wedding_id: string;
    vehicle_id: string;
    event_id: string | null;
    title: string;
    origin: string;
    destination: string;
    pickup_point: string | null;
    scheduled_pickup_time: string;
    estimated_arrival_time: string | null;
    status: TransportTrip["status"];
    notes: string | null;
    vehicle?: { provider_name: string; vehicle_type: TransportTrip["vehicleType"]; capacity: number } | null;
    event?: { name: string } | null;
    transport_passengers?: Array<{ passenger_count: number }>;
  }

  const rows = (data as RawTripRow[]) || [];
  const mapped: TransportTrip[] = rows.map((r) => {
    const assignedCount = r.transport_passengers?.reduce((acc, p) => acc + (p.passenger_count || 1), 0) || 0;
    const cap = r.vehicle?.capacity || 10;
    return {
      id: r.id,
      weddingId: r.wedding_id,
      vehicleId: r.vehicle_id,
      vehicleProviderName: r.vehicle?.provider_name,
      vehicleType: r.vehicle?.vehicle_type,
      totalCapacity: cap,
      eventId: r.event_id,
      eventName: r.event?.name || null,
      title: r.title,
      origin: r.origin,
      destination: r.destination,
      pickupPoint: r.pickup_point,
      scheduledPickupTime: r.scheduled_pickup_time,
      estimatedArrivalTime: r.estimated_arrival_time,
      status: r.status,
      passengerCount: assignedCount,
      availableSeats: Math.max(0, cap - assignedCount),
      notes: r.notes,
    };
  });

  return { success: true, data: mapped };
}

export async function createTransportTripAction(formData: FormData): Promise<LogisticsActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    vehicleId: formData.get("vehicleId") as string,
    eventId: (formData.get("eventId") as string) || null,
    title: formData.get("title") as string,
    origin: formData.get("origin") as string,
    destination: formData.get("destination") as string,
    pickupPoint: (formData.get("pickupPoint") as string) || null,
    scheduledPickupTime: formData.get("scheduledPickupTime") as string,
    estimatedArrivalTime: (formData.get("estimatedArrivalTime") as string) || null,
    status: (formData.get("status") as string) || "scheduled",
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = transportTripSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const newTrip: TransportTrip = {
      id: `mock-trip-${Date.now()}`,
      weddingId: validated.weddingId,
      vehicleId: validated.vehicleId,
      title: validated.title,
      origin: validated.origin,
      destination: validated.destination,
      pickupPoint: validated.pickupPoint,
      scheduledPickupTime: validated.scheduledPickupTime,
      estimatedArrivalTime: validated.estimatedArrivalTime,
      status: validated.status,
      passengerCount: 0,
      availableSeats: 15,
      notes: validated.notes,
    };
    return { success: true, data: newTrip };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("transport_trips") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      vehicle_id: validated.vehicleId,
      event_id: validated.eventId,
      title: validated.title,
      origin: validated.origin,
      destination: validated.destination,
      pickup_point: validated.pickupPoint,
      scheduled_pickup_time: validated.scheduledPickupTime,
      estimated_arrival_time: validated.estimatedArrivalTime,
      status: validated.status,
      notes: validated.notes,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/logistics");
  return { success: true, data };
}

// =====================================================================
// 4. ACCOMMODATION OPERATIONS
// =====================================================================
export async function getAccommodationPropertiesAction(
  weddingId: string
): Promise<LogisticsActionResult<AccommodationProperty[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_ACCOMMODATION_PROPERTIES.filter(
      (p) => p.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("accommodation_properties") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, rooms(id, status)")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };

  interface RawPropertyRow {
    id: string;
    wedding_id: string;
    name: string;
    address: string | null;
    city: string | null;
    contact_person: string | null;
    contact_phone: string | null;
    is_active: boolean;
    notes: string | null;
    rooms?: Array<{ id: string; status: string }>;
  }

  const rows = (data as RawPropertyRow[]) || [];
  const mapped: AccommodationProperty[] = rows.map((r) => {
    const total = r.rooms?.length || 0;
    const occupied = r.rooms?.filter((rm) => rm.status === "occupied").length || 0;
    return {
      id: r.id,
      weddingId: r.wedding_id,
      name: r.name,
      address: r.address,
      city: r.city,
      contactPerson: r.contact_person,
      contactPhone: r.contact_phone,
      isActive: r.is_active,
      notes: r.notes,
      totalRooms: total,
      occupiedRooms: occupied,
      vacantRooms: Math.max(0, total - occupied),
    };
  });

  return { success: true, data: mapped };
}

export async function getRoomInventoryAction(
  weddingId: string
): Promise<LogisticsActionResult<RoomInventory[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_ROOM_INVENTORY.filter(
      (r) => r.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("rooms") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, property:accommodation_properties(name)")
    .eq("wedding_id", weddingId)
    .order("room_number", { ascending: true });

  if (error) return { success: false, error: error.message };

  interface RawRoomRow {
    id: string;
    wedding_id: string;
    property_id: string;
    room_number: string;
    room_type: RoomInventory["roomType"];
    floor: string | null;
    max_occupancy: number;
    status: RoomInventory["status"];
    notes: string | null;
    property?: { name: string } | null;
  }

  const rows = (data as RawRoomRow[]) || [];
  const mapped: RoomInventory[] = rows.map((r) => ({
    id: r.id,
    weddingId: r.wedding_id,
    propertyId: r.property_id,
    propertyName: r.property?.name || undefined,
    roomNumber: r.room_number,
    roomType: r.room_type,
    floor: r.floor,
    maxOccupancy: r.max_occupancy,
    status: r.status,
    notes: r.notes,
  }));

  return { success: true, data: mapped };
}

export async function createRoomAllocationAction(
  formData: FormData
): Promise<LogisticsActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    roomId: formData.get("roomId") as string,
    guestId: (formData.get("guestId") as string) || null,
    householdId: (formData.get("householdId") as string) || null,
    occupancyCount: Number(formData.get("occupancyCount") || 1),
    checkInDate: formData.get("checkInDate") as string,
    checkOutDate: formData.get("checkOutDate") as string,
    status: (formData.get("status") as string) || "reserved",
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = roomAllocationSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  // Overlap and capacity checks
  if (!isSupabaseConfigured()) {
    const room = MOCK_ROOM_INVENTORY.find((r) => r.id === validated.roomId);
    if (room && validated.occupancyCount > room.maxOccupancy) {
      return { success: false, error: `Occupancy (${validated.occupancyCount}) exceeds room max capacity (${room.maxOccupancy}).` };
    }

    // Check date conflict with existing mock allocations for this room
    const hasConflict = MOCK_ROOM_ALLOCATIONS.some(
      (a) =>
        a.roomId === validated.roomId &&
        a.status !== "cancelled" &&
        !(validated.checkOutDate <= a.checkInDate || validated.checkInDate >= a.checkOutDate)
    );

    if (hasConflict) {
      return { success: false, error: "Room already has an overlapping active booking during these dates." };
    }

    const newAlloc: RoomAllocation = {
      id: `mock-ralloc-${Date.now()}`,
      weddingId: validated.weddingId,
      roomId: validated.roomId,
      roomNumber: room?.roomNumber || "101",
      propertyName: room?.propertyName || "The Grand Mewar Palace",
      guestId: validated.guestId,
      householdId: validated.householdId,
      occupancyCount: validated.occupancyCount,
      checkInDate: validated.checkInDate,
      checkOutDate: validated.checkOutDate,
      status: validated.status,
      notes: validated.notes,
    };
    return { success: true, data: newAlloc };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // 1. Room capacity check
  const { data: roomData } = await (supabase.from("rooms") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { max_occupancy: number; room_number: string } | null }> } };
  })
    .select("max_occupancy, room_number")
    .eq("id", validated.roomId)
    .single();

  if (roomData && validated.occupancyCount > roomData.max_occupancy) {
    return {
      success: false,
      error: `Requested occupancy (${validated.occupancyCount}) exceeds Room ${roomData.room_number} capacity (${roomData.max_occupancy}).`,
    };
  }

  // 2. Overlapping allocation check (Preventing double-booking race conditions)
  const { data: conflicts } = await (supabase.from("room_allocations") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        neq: (col: string, val: string) => {
          lt: (col: string, val: string) => {
            gt: (col: string, val: string) => Promise<{ data: Array<{ id: string }> | null }>;
          };
        };
      };
    };
  })
    .select("id")
    .eq("room_id", validated.roomId)
    .neq("status", "cancelled")
    .lt("check_in_date", validated.checkOutDate)
    .gt("check_out_date", validated.checkInDate);

  if (conflicts && conflicts.length > 0) {
    return {
      success: false,
      error: `Room ${roomData?.room_number || ""} already has a conflicting reservation for these dates.`,
    };
  }

  const { data, error } = await (supabase.from("room_allocations") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      room_id: validated.roomId,
      guest_id: validated.guestId,
      household_id: validated.householdId,
      occupancy_count: validated.occupancyCount,
      check_in_date: validated.checkInDate,
      check_out_date: validated.checkOutDate,
      status: validated.status,
      notes: validated.notes,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Update room status to occupied
  await (supabase.from("rooms") as unknown as {
    update: (row: unknown) => { eq: (col: string, val: string) => Promise<unknown> };
  })
    .update({ status: "occupied" })
    .eq("id", validated.roomId);

  revalidatePath("/dashboard/logistics");
  return { success: true, data };
}

