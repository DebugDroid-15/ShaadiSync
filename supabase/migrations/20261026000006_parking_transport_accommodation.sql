-- =====================================================================
-- Migration: 006_parking_transport_accommodation.sql
-- Description: Parking facilities & vehicle allocations, transport providers,
--              trips/routes & passenger manifests, accommodation properties,
--              rooms & guest room allocations with strict constraints & RLS.
-- =====================================================================

-- =====================================================================
-- 1. ENUMS
-- =====================================================================
CREATE TYPE parking_allocation_status_enum AS ENUM (
    'reserved',
    'allocated',
    'arrived',
    'cancelled'
);

CREATE TYPE vehicle_type_enum AS ENUM (
    'sedan',
    'suv',
    'tempo_traveller',
    'mini_bus',
    'bus',
    'two_wheeler',
    'other'
);

CREATE TYPE trip_status_enum AS ENUM (
    'scheduled',
    'boarding',
    'in_transit',
    'completed',
    'cancelled'
);

CREATE TYPE room_type_enum AS ENUM (
    'standard',
    'deluxe',
    'suite',
    'villa',
    'dormitory'
);

CREATE TYPE room_status_enum AS ENUM (
    'available',
    'occupied',
    'blocked',
    'maintenance'
);

CREATE TYPE room_allocation_status_enum AS ENUM (
    'reserved',
    'checked_in',
    'checked_out',
    'cancelled'
);

-- =====================================================================
-- 2. PARKING MANAGEMENT
-- =====================================================================

-- Parking Areas / Facilities
CREATE TABLE IF NOT EXISTS public.parking_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    location_description TEXT,
    total_capacity INT NOT NULL DEFAULT 20 CHECK (total_capacity >= 0),
    is_accessible BOOLEAN NOT NULL DEFAULT FALSE,
    is_valet_available BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_parking_areas_updated_at ON public.parking_areas;
CREATE TRIGGER set_parking_areas_updated_at
    BEFORE UPDATE ON public.parking_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_parking_areas_wedding ON public.parking_areas(wedding_id);
CREATE INDEX IF NOT EXISTS idx_parking_areas_event ON public.parking_areas(event_id);

-- Parking Allocations (Vehicle/Guest/Household assignments)
CREATE TABLE IF NOT EXISTS public.parking_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    parking_area_id UUID NOT NULL REFERENCES public.parking_areas(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    vehicle_type vehicle_type_enum NOT NULL DEFAULT 'sedan',
    vehicle_registration TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    slot_number TEXT,
    status parking_allocation_status_enum NOT NULL DEFAULT 'allocated',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_parking_allocations_updated_at ON public.parking_allocations;
CREATE TRIGGER set_parking_allocations_updated_at
    BEFORE UPDATE ON public.parking_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_parking_allocations_area ON public.parking_allocations(parking_area_id);
CREATE INDEX IF NOT EXISTS idx_parking_allocations_wedding ON public.parking_allocations(wedding_id);

-- =====================================================================
-- 3. TRANSPORTATION MANAGEMENT
-- =====================================================================

-- Transport Providers / Fleet Vehicles
CREATE TABLE IF NOT EXISTS public.transport_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    provider_name TEXT NOT NULL,
    vehicle_type vehicle_type_enum NOT NULL DEFAULT 'tempo_traveller',
    registration_number TEXT,
    capacity INT NOT NULL DEFAULT 12 CHECK (capacity >= 1),
    driver_name TEXT,
    driver_phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_transport_vehicles_updated_at ON public.transport_vehicles;
CREATE TRIGGER set_transport_vehicles_updated_at
    BEFORE UPDATE ON public.transport_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_transport_vehicles_wedding ON public.transport_vehicles(wedding_id);

-- Transport Trips / Routes
CREATE TABLE IF NOT EXISTS public.transport_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.transport_vehicles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_point TEXT,
    scheduled_pickup_time TIMESTAMPTZ NOT NULL,
    estimated_arrival_time TIMESTAMPTZ,
    status trip_status_enum NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_transport_trips_updated_at ON public.transport_trips;
CREATE TRIGGER set_transport_trips_updated_at
    BEFORE UPDATE ON public.transport_trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_transport_trips_wedding ON public.transport_trips(wedding_id);
CREATE INDEX IF NOT EXISTS idx_transport_trips_vehicle ON public.transport_trips(vehicle_id);

-- Transport Passenger Assignments
CREATE TABLE IF NOT EXISTS public.transport_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.transport_trips(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    passenger_count INT NOT NULL DEFAULT 1 CHECK (passenger_count >= 1),
    pickup_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(trip_id, guest_id)
);

CREATE INDEX IF NOT EXISTS idx_transport_passengers_trip ON public.transport_passengers(trip_id);
CREATE INDEX IF NOT EXISTS idx_transport_passengers_guest ON public.transport_passengers(guest_id);

-- =====================================================================
-- 4. ACCOMMODATION MANAGEMENT
-- =====================================================================

-- Accommodation Properties (Hotels, Resorts, Havelis, Guest Houses)
CREATE TABLE IF NOT EXISTS public.accommodation_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_accommodation_properties_updated_at ON public.accommodation_properties;
CREATE TRIGGER set_accommodation_properties_updated_at
    BEFORE UPDATE ON public.accommodation_properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_accommodation_properties_wedding ON public.accommodation_properties(wedding_id);

-- Rooms Inventory
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.accommodation_properties(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    room_type room_type_enum NOT NULL DEFAULT 'deluxe',
    floor TEXT,
    max_occupancy INT NOT NULL DEFAULT 2 CHECK (max_occupancy >= 1),
    status room_status_enum NOT NULL DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

DROP TRIGGER IF EXISTS set_rooms_updated_at ON public.rooms;
CREATE TRIGGER set_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_rooms_property ON public.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_wedding ON public.rooms(wedding_id);

-- Room Allocations / Bookings
CREATE TABLE IF NOT EXISTS public.room_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    occupancy_count INT NOT NULL DEFAULT 1 CHECK (occupancy_count >= 1),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status room_allocation_status_enum NOT NULL DEFAULT 'reserved',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (check_out_date >= check_in_date)
);

DROP TRIGGER IF EXISTS set_room_allocations_updated_at ON public.room_allocations;
CREATE TRIGGER set_room_allocations_updated_at
    BEFORE UPDATE ON public.room_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_room_allocations_room ON public.room_allocations(room_id);
CREATE INDEX IF NOT EXISTS idx_room_allocations_wedding ON public.room_allocations(wedding_id);
CREATE INDEX IF NOT EXISTS idx_room_allocations_dates ON public.room_allocations(room_id, check_in_date, check_out_date);

-- =====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.parking_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- PARKING AREAS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "parking_areas_select"
    ON public.parking_areas FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "parking_areas_modify"
    ON public.parking_areas FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = parking_areas.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- PARKING ALLOCATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "parking_allocations_select"
    ON public.parking_allocations FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "parking_allocations_modify"
    ON public.parking_allocations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = parking_allocations.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- TRANSPORT VEHICLES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "transport_vehicles_select"
    ON public.transport_vehicles FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "transport_vehicles_modify"
    ON public.transport_vehicles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = transport_vehicles.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- TRANSPORT TRIPS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "transport_trips_select"
    ON public.transport_trips FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "transport_trips_modify"
    ON public.transport_trips FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = transport_trips.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- TRANSPORT PASSENGERS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "transport_passengers_select"
    ON public.transport_passengers FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "transport_passengers_modify"
    ON public.transport_passengers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = transport_passengers.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- ACCOMMODATION PROPERTIES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "accommodation_properties_select"
    ON public.accommodation_properties FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "accommodation_properties_modify"
    ON public.accommodation_properties FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = accommodation_properties.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- ROOMS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "rooms_select"
    ON public.rooms FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "rooms_modify"
    ON public.rooms FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = rooms.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- ROOM ALLOCATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "room_allocations_select"
    ON public.room_allocations FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "room_allocations_modify"
    ON public.room_allocations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = room_allocations.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

