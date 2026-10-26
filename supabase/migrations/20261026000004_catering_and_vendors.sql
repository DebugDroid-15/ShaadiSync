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

