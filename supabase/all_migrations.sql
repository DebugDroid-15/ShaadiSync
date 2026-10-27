-- =====================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core multi-tenant architecture, auth profiles, organisations,
--              organisation memberships, weddings, wedding memberships,
--              and Row Level Security (RLS) policies.
-- =====================================================================

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Automatically create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Organisations table
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    billing_tier TEXT NOT NULL DEFAULT 'free' CHECK (billing_tier IN ('free', 'pro', 'enterprise')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_organisations_updated_at ON public.organisations;
CREATE TRIGGER set_organisations_updated_at
    BEFORE UPDATE ON public.organisations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Organisation Members table
CREATE TYPE org_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE IF NOT EXISTS public.organisation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role org_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organisation_id, user_id)
);

-- Index for fast user membership lookups
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organisation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organisation_members(organisation_id);

-- 5. Weddings table
CREATE TYPE wedding_status_type AS ENUM ('planning', 'active', 'completed', 'archived');

CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    couple_bride_name TEXT NOT NULL,
    couple_groom_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    primary_city TEXT NOT NULL,
    status wedding_status_type NOT NULL DEFAULT 'planning',
    total_budget NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (total_budget >= 0),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organisation_id, slug),
    CHECK (end_date >= start_date)
);

DROP TRIGGER IF EXISTS set_weddings_updated_at ON public.weddings;
CREATE TRIGGER set_weddings_updated_at
    BEFORE UPDATE ON public.weddings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_weddings_org ON public.weddings(organisation_id);

-- 6. Wedding Members table (scoping event staff to specific weddings)
CREATE TYPE wedding_role AS ENUM ('wedding_lead', 'coordinator', 'checkin_staff', 'viewer');

CREATE TABLE IF NOT EXISTS public.wedding_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role wedding_role NOT NULL DEFAULT 'coordinator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wedding_members_user ON public.wedding_members(user_id);
CREATE INDEX IF NOT EXISTS idx_wedding_members_wedding ON public.wedding_members(wedding_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Helper RLS security-definer functions to prevent recursive evaluation
-- ---------------------------------------------------------------------

-- Returns true if current user is member of given organisation
CREATE OR REPLACE FUNCTION public.is_org_member(target_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organisation_members
        WHERE organisation_id = target_org_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Returns true if current user is owner or admin of given organisation
CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organisation_members
        WHERE organisation_id = target_org_id
          AND user_id = auth.uid()
          AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Returns true if current user is member of given wedding OR org admin
CREATE OR REPLACE FUNCTION public.can_access_wedding(target_wedding_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organisation_id INTO v_org_id
    FROM public.weddings
    WHERE id = target_wedding_id;

    IF v_org_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Org admin/owner has access to all weddings in their org
    IF public.is_org_admin(v_org_id) THEN
        RETURN TRUE;
    END IF;

    -- Otherwise, must be explicitly assigned in wedding_members
    RETURN EXISTS (
        SELECT 1 FROM public.wedding_members
        WHERE wedding_id = target_wedding_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ---------------------------------------------------------------------
-- PROFILES POLICIES
-- ---------------------------------------------------------------------
-- Users can read their own profile, or profiles of members in their organisations
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.organisation_members om1
            JOIN public.organisation_members om2 ON om1.organisation_id = om2.organisation_id
            WHERE om1.user_id = auth.uid() AND om2.user_id = profiles.id
        )
    );

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------
-- ORGANISATIONS POLICIES
-- ---------------------------------------------------------------------
-- Users can view organisations they belong to
CREATE POLICY "organisations_select"
    ON public.organisations FOR SELECT
    USING (public.is_org_member(id));

-- Any authenticated user can create a new organisation
CREATE POLICY "organisations_insert"
    ON public.organisations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only owners and admins can update organisation details
CREATE POLICY "organisations_update"
    ON public.organisations FOR UPDATE
    USING (public.is_org_admin(id))
    WITH CHECK (public.is_org_admin(id));

-- Only owners can delete an organisation
CREATE POLICY "organisations_delete"
    ON public.organisations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.organisation_members
            WHERE organisation_id = organisations.id
              AND user_id = auth.uid()
              AND role = 'owner'
        )
    );

-- ---------------------------------------------------------------------
-- ORGANISATION MEMBERS POLICIES
-- ---------------------------------------------------------------------
-- Members can view team members in their own organisations
CREATE POLICY "org_members_select"
    ON public.organisation_members FOR SELECT
    USING (public.is_org_member(organisation_id));

-- Only admins/owners can add members to their organisations
CREATE POLICY "org_members_insert"
    ON public.organisation_members FOR INSERT
    WITH CHECK (
        public.is_org_admin(organisation_id) OR
        -- Allow the creator of a brand new org to insert themselves as owner
        (auth.uid() = user_id AND role = 'owner' AND NOT EXISTS (
            SELECT 1 FROM public.organisation_members WHERE organisation_id = organisation_members.organisation_id
        ))
    );

-- Only admins/owners can update roles in their organisation
CREATE POLICY "org_members_update"
    ON public.organisation_members FOR UPDATE
    USING (public.is_org_admin(organisation_id))
    WITH CHECK (public.is_org_admin(organisation_id));

-- Only admins/owners can remove members (members can also remove themselves)
CREATE POLICY "org_members_delete"
    ON public.organisation_members FOR DELETE
    USING (public.is_org_admin(organisation_id) OR user_id = auth.uid());

-- ---------------------------------------------------------------------
-- WEDDINGS POLICIES
-- ---------------------------------------------------------------------
-- Accessible if member of wedding or org admin
CREATE POLICY "weddings_select"
    ON public.weddings FOR SELECT
    USING (public.can_access_wedding(id));

-- Only org admins or wedding leads can create new weddings
CREATE POLICY "weddings_insert"
    ON public.weddings FOR INSERT
    WITH CHECK (public.is_org_admin(organisation_id));

-- Only org admins or wedding leads can update wedding details
CREATE POLICY "weddings_update"
    ON public.weddings FOR UPDATE
    USING (public.is_org_admin(organisation_id))
    WITH CHECK (public.is_org_admin(organisation_id));

-- Only org owners/admins can delete/archive a wedding
CREATE POLICY "weddings_delete"
    ON public.weddings FOR DELETE
    USING (public.is_org_admin(organisation_id));

-- ---------------------------------------------------------------------
-- WEDDING MEMBERS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "wedding_members_select"
    ON public.wedding_members FOR SELECT
    USING (
        public.can_access_wedding(wedding_id)
    );

CREATE POLICY "wedding_members_insert"
    ON public.wedding_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = wedding_members.wedding_id
              AND public.is_org_admin(w.organisation_id)
        )
    );

CREATE POLICY "wedding_members_delete"
    ON public.wedding_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = wedding_members.wedding_id
              AND public.is_org_admin(w.organisation_id)
        )
    );
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
-- =====================================================================
-- Migration: 003_rsvps_and_tokens.sql
-- Description: RSVPs table, token revocation & expiration columns,
--              and public token-scoped RLS policies for /invite/[token].
-- =====================================================================

-- 1. Add token revocation and expiration columns to guests table
ALTER TABLE public.guests
    ADD COLUMN IF NOT EXISTS token_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_guests_token_active ON public.guests(invitation_token)
    WHERE token_revoked IS FALSE;

-- 2. RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_invitation_id UUID NOT NULL REFERENCES public.event_invitations(id) ON DELETE CASCADE,
    attending BOOLEAN NOT NULL,
    adult_count INT NOT NULL DEFAULT 1 CHECK (adult_count >= 0),
    child_count INT NOT NULL DEFAULT 0 CHECK (child_count >= 0),
    dietary_pref dietary_pref_enum NOT NULL DEFAULT 'veg',
    dietary_notes TEXT,
    accompanying_names TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash TEXT,
    UNIQUE (event_invitation_id)
);

DROP TRIGGER IF EXISTS set_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER set_rsvps_updated_at
    BEFORE UPDATE ON public.rsvps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation ON public.rsvps(event_invitation_id);

-- 3. Security Definer helper: verify valid unrevoked unexpired token
CREATE OR REPLACE FUNCTION public.get_guest_id_by_token(token TEXT)
RETURNS UUID AS $$
DECLARE
    v_guest_id UUID;
BEGIN
    SELECT id INTO v_guest_id
    FROM public.guests
    WHERE invitation_token = token
      AND token_revoked IS FALSE
      AND (token_expires_at IS NULL OR token_expires_at > NOW());

    RETURN v_guest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3b. Security Definer helper: verify guest event access without RLS recursion
CREATE OR REPLACE FUNCTION public.can_guest_access_event(target_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.event_invitations ei
        JOIN public.guests g ON g.id = ei.guest_id
        WHERE ei.event_id = target_event_id
          AND g.token_revoked IS FALSE
          AND (g.token_expires_at IS NULL OR g.token_expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. Row Level Security on RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Organiser access: allowed if user has wedding access
CREATE POLICY "rsvps_organizer_select"
    ON public.rsvps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.event_invitations ei
            JOIN public.events e ON e.id = ei.event_id
            WHERE ei.id = rsvps.event_invitation_id
              AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "rsvps_organizer_all"
    ON public.rsvps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.event_invitations ei
            JOIN public.events e ON e.id = ei.event_id
            WHERE ei.id = rsvps.event_invitation_id
              AND public.can_access_wedding(e.wedding_id)
        )
    );

-- Allow public anonymous reads on event_invitations and events STRICTLY for guests with a matching token
CREATE POLICY "event_invitations_token_read"
    ON public.event_invitations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.guests g
            WHERE g.id = event_invitations.guest_id
              AND g.token_revoked IS FALSE
              AND (g.token_expires_at IS NULL OR g.token_expires_at > NOW())
        )
    );

CREATE POLICY "events_token_read"
    ON public.events FOR SELECT
    USING (public.can_guest_access_event(id));
-- =====================================================================
-- Migration: 004_catering_and_vendors.sql
-- Description: Vendors, Vendor Bookings, and Event-Specific Meal Plans
--              with strict Row Level Security (RLS) and constraints.
-- =====================================================================

-- 1. Vendors table
CREATE TYPE vendor_category_enum AS ENUM (
    'caterer', 'decorator', 'photographer', 'videographer',
    'makeup', 'dj', 'priest', 'florist', 'transport', 'venue', 'other'
);

CREATE TYPE vendor_booking_status_enum AS ENUM (
    'inquiry', 'quoted', 'booked', 'completed', 'cancelled'
);

CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category vendor_category_enum NOT NULL DEFAULT 'other',
    contact_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    booking_status vendor_booking_status_enum NOT NULL DEFAULT 'inquiry',
    quoted_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (quoted_price >= 0),
    agreed_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (agreed_price >= 0),
    advance_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (advance_paid >= 0),
    balance_due NUMERIC(12,2) GENERATED ALWAYS AS (GREATEST(0.00, agreed_price - advance_paid)) STORED,
    payment_due_date DATE,
    arrival_time TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_vendors_updated_at ON public.vendors;
CREATE TRIGGER set_vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_vendors_wedding ON public.vendors(wedding_id);

-- 2. Vendor Function Assignments (links vendors to specific ceremonies)
CREATE TABLE IF NOT EXISTS public.vendor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    service_description TEXT,
    arrival_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vendor_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_assignments_vendor ON public.vendor_assignments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_assignments_event ON public.vendor_assignments(event_id);

-- 3. Meal Plans table (event-specific banquet meal plans)
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'high_tea', 'dinner');
CREATE TYPE service_style_enum AS ENUM ('buffet', 'seated_thali', 'cocktail', 'food_stations');

CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    meal_type meal_type_enum NOT NULL DEFAULT 'dinner',
    service_style service_style_enum NOT NULL DEFAULT 'buffet',
    menu_description TEXT,
    planned_per_plate_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (planned_per_plate_cost >= 0),
    buffer_percentage INT NOT NULL DEFAULT 10 CHECK (buffer_percentage >= 0 AND buffer_percentage <= 50),
    is_guarantee_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_guarantee_headcount INT CHECK (approved_guarantee_headcount IS NULL OR approved_guarantee_headcount >= 0),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, meal_type)
);

DROP TRIGGER IF EXISTS set_meal_plans_updated_at ON public.meal_plans;
CREATE TRIGGER set_meal_plans_updated_at
    BEFORE UPDATE ON public.meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_meal_plans_event ON public.meal_plans(event_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- VENDORS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "vendors_select"
    ON public.vendors FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "vendors_insert"
    ON public.vendors FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = vendors.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

CREATE POLICY "vendors_update"
    ON public.vendors FOR UPDATE
    USING (public.can_access_wedding(wedding_id))
    WITH CHECK (public.can_access_wedding(wedding_id));

CREATE POLICY "vendors_delete"
    ON public.vendors FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = vendors.wedding_id AND public.is_org_admin(w.organisation_id)
        )
    );

-- ---------------------------------------------------------------------
-- VENDOR ASSIGNMENTS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "vendor_assignments_select"
    ON public.vendor_assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = vendor_assignments.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "vendor_assignments_modify"
    ON public.vendor_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = vendor_assignments.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

-- ---------------------------------------------------------------------
-- MEAL PLANS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "meal_plans_select"
    ON public.meal_plans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = meal_plans.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

CREATE POLICY "meal_plans_modify"
    ON public.meal_plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = meal_plans.event_id AND public.can_access_wedding(e.wedding_id)
        )
    );

-- =====================================================================
-- Migration: 005_budget_expenses_payments.sql
-- Description: Wedding & function budgets, expense records, payment vouchers,
--              audit log for financial changes, and Row Level Security.
-- =====================================================================

-- 1. Budget Categories Enum
CREATE TYPE expense_category_enum AS ENUM (
    'venue',
    'catering',
    'decor',
    'photography',
    'entertainment',
    'attire_makeup',
    'transport_logistics',
    'invitations_gifts',
    'priest_rituals',
    'miscellaneous'
);

CREATE TYPE payment_mode_enum AS ENUM (
    'bank_transfer',
    'upi',
    'cash',
    'cheque',
    'card',
    'other'
);

CREATE TYPE payment_type_enum AS ENUM (
    'advance',
    'milestone',
    'final',
    'refund',
    'correction'
);

-- 2. Budget Allocations Table (Wedding-wide and function-specific category targets)
CREATE TABLE IF NOT EXISTS public.budget_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    category expense_category_enum NOT NULL,
    allocated_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (allocated_amount >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(wedding_id, event_id, category)
);

DROP TRIGGER IF EXISTS set_budget_allocations_updated_at ON public.budget_allocations;
CREATE TRIGGER set_budget_allocations_updated_at
    BEFORE UPDATE ON public.budget_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_budget_allocations_wedding ON public.budget_allocations(wedding_id);

-- 3. Expenses Table (Individual expenses: can link to a vendor or be standalone)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    category expense_category_enum NOT NULL DEFAULT 'miscellaneous',
    title TEXT NOT NULL,
    description TEXT,
    estimated_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (estimated_amount >= 0),
    actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (actual_amount >= 0),
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    invoice_number TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_expenses_updated_at ON public.expenses;
CREATE TRIGGER set_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_expenses_wedding ON public.expenses(wedding_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON public.expenses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_expenses_event ON public.expenses(event_id);

-- 4. Payments Table (Actual cash/UPI/bank payments made against vendors or expenses)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount <> 0), -- positive for payment, negative for refund
    payment_type payment_type_enum NOT NULL DEFAULT 'advance',
    payment_mode payment_mode_enum NOT NULL DEFAULT 'bank_transfer',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number TEXT,
    paid_by_name TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_payments_updated_at ON public.payments;
CREATE TRIGGER set_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payments_wedding ON public.payments(wedding_id);
CREATE INDEX IF NOT EXISTS idx_payments_vendor ON public.payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payments_expense ON public.payments(expense_id);

-- 5. Financial Audit Log Table (Tracking all monetary modifications)
CREATE TABLE IF NOT EXISTS public.financial_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'expense', 'payment', 'budget_allocation', 'vendor'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_audit_wedding ON public.financial_audit_logs(wedding_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_audit_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- BUDGET ALLOCATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "budget_allocations_select"
    ON public.budget_allocations FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "budget_allocations_modify"
    ON public.budget_allocations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = budget_allocations.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- EXPENSES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "expenses_select"
    ON public.expenses FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "expenses_modify"
    ON public.expenses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = expenses.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- PAYMENTS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "payments_select"
    ON public.payments FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "payments_modify"
    ON public.payments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = payments.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- FINANCIAL AUDIT LOGS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "financial_audit_logs_select"
    ON public.financial_audit_logs FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "financial_audit_logs_insert"
    ON public.financial_audit_logs FOR INSERT
    WITH CHECK (public.can_access_wedding(wedding_id));

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

-- =====================================================================
-- Migration: 007_qr_passes_and_checkin.sql
-- Description: Event-specific QR Passes, Check-in Gates, Attendance Records,
--              Override Audit Logs, and Concurrency Protections with RLS.
-- =====================================================================

-- =====================================================================
-- 1. ENUMS
-- =====================================================================
CREATE TYPE pass_status_enum AS ENUM (
    'active',
    'revoked',
    'expired'
);

CREATE TYPE checkin_method_enum AS ENUM (
    'qr_scan',
    'manual_lookup',
    'manual_override'
);

-- =====================================================================
-- 2. CHECK-IN GATES / STATIONS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.checkin_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location_description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, name)
);

DROP TRIGGER IF EXISTS set_checkin_gates_updated_at ON public.checkin_gates;
CREATE TRIGGER set_checkin_gates_updated_at
    BEFORE UPDATE ON public.checkin_gates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_checkin_gates_wedding ON public.checkin_gates(wedding_id);
CREATE INDEX IF NOT EXISTS idx_checkin_gates_event ON public.checkin_gates(event_id);

-- =====================================================================
-- 3. EVENT-SPECIFIC QR PASSES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.qr_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    event_invitation_id UUID REFERENCES public.event_invitations(id) ON DELETE SET NULL,
    pass_code TEXT NOT NULL UNIQUE, -- high-entropy public bearer pass code, e.g. "pass_sng_7f8a92b"
    token_hash TEXT NOT NULL, -- SHA-256 hash of secret QR signature token
    permitted_attendees_count INT NOT NULL DEFAULT 1 CHECK (permitted_attendees_count >= 1),
    status pass_status_enum NOT NULL DEFAULT 'active',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, guest_id)
);

DROP TRIGGER IF EXISTS set_qr_passes_updated_at ON public.qr_passes;
CREATE TRIGGER set_qr_passes_updated_at
    BEFORE UPDATE ON public.qr_passes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_qr_passes_wedding ON public.qr_passes(wedding_id);
CREATE INDEX IF NOT EXISTS idx_qr_passes_event ON public.qr_passes(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_passes_guest ON public.qr_passes(guest_id);
CREATE INDEX IF NOT EXISTS idx_qr_passes_code ON public.qr_passes(pass_code);

-- =====================================================================
-- 4. ATTENDANCE CHECK-IN RECORDS (ATOMIC CONCURRENCY GUARANTEED)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    pass_id UUID REFERENCES public.qr_passes(id) ON DELETE SET NULL,
    gate_id UUID REFERENCES public.checkin_gates(id) ON DELETE SET NULL,
    checked_in_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    checkin_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checkin_method checkin_method_enum NOT NULL DEFAULT 'qr_scan',
    admitted_count INT NOT NULL DEFAULT 1 CHECK (admitted_count >= 1),
    operator_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, guest_id) -- Concurrency & Duplicate Scan Protection Invariant
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_wedding ON public.attendance_records(wedding_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_event ON public.attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_guest ON public.attendance_records(guest_id);

-- =====================================================================
-- 5. CHECK-IN OVERRIDE & EXCEPTION AUDIT LOGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.checkin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'SCAN_SUCCESS', 'DUPLICATE_ATTEMPT', 'MANUAL_OVERRIDE', 'PASS_REVOKED', 'PASS_REISSUED', 'CHECKIN_REMOVED'
    details JSONB,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkin_audit_wedding ON public.checkin_audit_logs(wedding_id);
CREATE INDEX IF NOT EXISTS idx_checkin_audit_event ON public.checkin_audit_logs(event_id);

-- =====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.checkin_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- CHECKIN GATES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "checkin_gates_select"
    ON public.checkin_gates FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "checkin_gates_modify"
    ON public.checkin_gates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = checkin_gates.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- QR PASSES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "qr_passes_select"
    ON public.qr_passes FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "qr_passes_modify"
    ON public.qr_passes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = qr_passes.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator', 'checkin_staff')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- ATTENDANCE RECORDS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "attendance_records_select"
    ON public.attendance_records FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "attendance_records_insert"
    ON public.attendance_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = attendance_records.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator', 'checkin_staff')
              ))
        )
    );

CREATE POLICY "attendance_records_modify"
    ON public.attendance_records FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w
            WHERE w.id = attendance_records.wedding_id
              AND (public.is_org_admin(w.organisation_id) OR EXISTS (
                  SELECT 1 FROM public.wedding_members wm
                  WHERE wm.wedding_id = w.id AND wm.user_id = auth.uid() AND wm.role IN ('wedding_lead', 'coordinator')
              ))
        )
    );

-- ---------------------------------------------------------------------
-- CHECKIN AUDIT LOGS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "checkin_audit_logs_select"
    ON public.checkin_audit_logs FOR SELECT
    USING (public.can_access_wedding(wedding_id));

CREATE POLICY "checkin_audit_logs_insert"
    ON public.checkin_audit_logs FOR INSERT
    WITH CHECK (public.can_access_wedding(wedding_id));

-- =====================================================================
-- COMPLETE FIX: Eliminate infinite recursion in relation "events" and "event_invitations"
-- =====================================================================

-- Step 1: Drop all existing SELECT policies on both tables
DROP POLICY IF EXISTS "events_select" ON public.events;
DROP POLICY IF EXISTS "events_token_read" ON public.events;
DROP POLICY IF EXISTS "invitations_select" ON public.event_invitations;
DROP POLICY IF EXISTS "invitations_insert" ON public.event_invitations;
DROP POLICY IF EXISTS "invitations_update" ON public.event_invitations;
DROP POLICY IF EXISTS "invitations_delete" ON public.event_invitations;
DROP POLICY IF EXISTS "event_invitations_token_read" ON public.event_invitations;

-- Step 2: Define Security-Definer Helpers
-- Helper A: Check if current authenticated user has access to the event's wedding
CREATE OR REPLACE FUNCTION public.can_access_event(target_event_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_wedding_id UUID;
BEGIN
    SELECT wedding_id INTO v_wedding_id
    FROM public.events
    WHERE id = target_event_id;

    IF v_wedding_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN public.can_access_wedding(v_wedding_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper B: Check if an event is accessible via a valid guest invitation token
CREATE OR REPLACE FUNCTION public.can_guest_access_event(target_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.event_invitations ei
        JOIN public.guests g ON g.id = ei.guest_id
        WHERE ei.event_id = target_event_id
          AND g.token_revoked IS FALSE
          AND (g.token_expires_at IS NULL OR g.token_expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 3: Recreate Clean, Non-Recursive Policies on public.events
CREATE POLICY "events_select"
    ON public.events FOR SELECT
    USING (
        public.can_access_wedding(wedding_id)
        OR public.can_guest_access_event(id)
    );

-- Step 4: Recreate Clean Policies on public.event_invitations
CREATE POLICY "invitations_select"
    ON public.event_invitations FOR SELECT
    USING (
        public.can_access_event(event_id)
        OR EXISTS (
            SELECT 1 FROM public.guests g
            WHERE g.id = event_invitations.guest_id
              AND g.token_revoked IS FALSE
              AND (g.token_expires_at IS NULL OR g.token_expires_at > NOW())
        )
    );

CREATE POLICY "invitations_insert"
    ON public.event_invitations FOR INSERT
    WITH CHECK (public.can_access_event(event_id));

CREATE POLICY "invitations_update"
    ON public.event_invitations FOR UPDATE
    USING (public.can_access_event(event_id))
    WITH CHECK (public.can_access_event(event_id));

CREATE POLICY "invitations_delete"
    ON public.event_invitations FOR DELETE
    USING (public.can_access_event(event_id));
