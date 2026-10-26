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
