-- =====================================================================
-- Migration: 002_functions_households_guests.sql
-- Description: Venues, Events/Functions, Households, Guests, and Event Invitations
--              with strict Row Level Security (RLS) policies and constraints.
-- =====================================================================

-- 1. Venues table
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    google_maps_url TEXT,
    contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_venues_updated_at ON public.venues;
CREATE TRIGGER set_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_venues_wedding ON public.venues(wedding_id);

-- 2. Events / Functions table
CREATE TYPE event_type_enum AS ENUM ('roka', 'haldi', 'mehendi', 'sangeet', 'ceremony', 'reception', 'custom');

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    event_type event_type_enum NOT NULL DEFAULT 'custom',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    guest_capacity INT NOT NULL DEFAULT 100 CHECK (guest_capacity > 0),
    dress_code TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time >= start_time)
);

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_events_wedding ON public.events(wedding_id);

-- 3. Households table
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    family_name TEXT NOT NULL,
    primary_contact_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    city TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_households_updated_at ON public.households;
CREATE TRIGGER set_households_updated_at
    BEFORE UPDATE ON public.households
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_households_wedding ON public.households(wedding_id);

-- 4. Guests table
CREATE TYPE guest_side_enum AS ENUM ('bride', 'groom', 'mutual');
CREATE TYPE guest_category_enum AS ENUM ('family', 'close_friend', 'colleague', 'vip');
CREATE TYPE age_group_enum AS ENUM ('adult', 'child');
CREATE TYPE dietary_pref_enum AS ENUM ('veg', 'jain', 'non_veg', 'vegan');

CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    side guest_side_enum NOT NULL DEFAULT 'mutual',
    category guest_category_enum NOT NULL DEFAULT 'family',
    age_group age_group_enum NOT NULL DEFAULT 'adult',
    phone TEXT,
    email TEXT,
    dietary_pref dietary_pref_enum NOT NULL DEFAULT 'veg',
    allergies_notes TEXT,
    is_vip BOOLEAN NOT NULL DEFAULT FALSE,
    invitation_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_guests_updated_at ON public.guests;
CREATE TRIGGER set_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_guests_wedding ON public.guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_household ON public.guests(household_id);
CREATE INDEX IF NOT EXISTS idx_guests_token ON public.guests(invitation_token);

-- 5. Event Invitations (selective per-function assignments)
CREATE TYPE invitation_status_enum AS ENUM ('invited', 'declined', 'confirmed', 'tentative');

CREATE TABLE IF NOT EXISTS public.event_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    status invitation_status_enum NOT NULL DEFAULT 'invited',
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE (event_id, guest_id)
);

CREATE INDEX IF NOT EXISTS idx_invitations_event ON public.event_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_invitations_guest ON public.event_invitations(guest_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- VENUES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "venues_select"
    ON public.venues FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "venues_insert"
    ON public.venues FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = venues.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

CREATE POLICY "venues_update"
    ON public.venues FOR UPDATE
    USING (public.can_access_wedding(wedding_id))
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "venues_delete"
    ON public.venues FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = venues.wedding_id AND public.is_org_admin(w.organisation_id)
        )
    );

-- ---------------------------------------------------------------------
-- EVENTS / FUNCTIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "events_select"
    ON public.events FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "events_insert"
    ON public.events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = events.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

CREATE POLICY "events_update"
    ON public.events FOR UPDATE
    USING (public.can_access_wedding(wedding_id))
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "events_delete"
    ON public.events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = events.wedding_id AND public.is_org_admin(w.organisation_id)
        )
    );

-- ---------------------------------------------------------------------
-- HOUSEHOLDS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "households_select"
    ON public.households FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "households_insert"
    ON public.households FOR INSERT
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "households_update"
    ON public.households FOR UPDATE
    USING (public.can_access_wedding(wedding_id))
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "households_delete"
    ON public.households FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = households.wedding_id AND public.is_org_admin(w.organisation_id)
        )
    );

-- ---------------------------------------------------------------------
-- GUESTS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "guests_select"
    ON public.guests FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "guests_insert"
    ON public.guests FOR INSERT
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "guests_update"
    ON public.guests FOR UPDATE
    USING (public.can_access_wedding(wedding_id))
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "guests_delete"
    ON public.guests FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = guests.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- EVENT INVITATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "invitations_select"
    ON public.event_invitations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_invitations.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "invitations_insert"
    ON public.event_invitations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_invitations.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "invitations_update"
    ON public.event_invitations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_invitations.event_id AND public.can_access_wedding(e.wedding_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_invitations.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "invitations_delete"
    ON public.event_invitations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_invitations.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );
