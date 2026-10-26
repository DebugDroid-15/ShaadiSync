-- =====================================================================
-- Seed Data: seed.sql
-- Description: Fictional development test dataset representing multi-tenant
--              organisations, members, weddings, and staff allocations.
-- =====================================================================

-- Note: In production Supabase, users are created in auth.users.
-- For local testing and standalone execution, we populate fixture records.

-- 1. Fictional UUIDs for deterministic testing
-- Org A: Royal Heritage Events (Amar Khera - Owner, Ananya Rout - Member/Coordinator)
-- Org B: Vivaah Logistics & Co (Lucky Kumar - Owner, Omm Prakash Sahoo - Member/Coordinator)

DO $$
DECLARE
    -- Org A fixtures
    uid_amar UUID := 'a0000000-0000-0000-0000-000000000001';
    uid_ananya UUID := 'a0000000-0000-0000-0000-000000000002';
    org_royal UUID := 'b0000000-0000-0000-0000-000000000001';
    wed_udaipur UUID := 'c0000000-0000-0000-0000-000000000001';
    wed_jaipur UUID := 'c0000000-0000-0000-0000-000000000002';

    -- Org B fixtures
    uid_lucky UUID := 'a0000000-0000-0000-0000-000000000003';
    uid_omm UUID := 'a0000000-0000-0000-0000-000000000004';
    org_vivaah UUID := 'b0000000-0000-0000-0000-000000000002';
    wed_goa UUID := 'c0000000-0000-0000-0000-000000000003';
BEGIN

    -- Insert mock profiles (assuming corresponding auth.users exists or mock environment)
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES
        (uid_amar, 'Amar Khera', 'https://api.dicebear.com/7.x/initials/svg?seed=AK', '+91 98765 00001'),
        (uid_ananya, 'Ananya Rout', 'https://api.dicebear.com/7.x/initials/svg?seed=AR', '+91 98765 00002'),
        (uid_lucky, 'Lucky Kumar', 'https://api.dicebear.com/7.x/initials/svg?seed=LK', '+91 98765 00003'),
        (uid_omm, 'Omm Prakash Sahoo', 'https://api.dicebear.com/7.x/initials/svg?seed=OS', '+91 98765 00004')
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone;

    -- Insert Organisations
    INSERT INTO public.organisations (id, name, slug, billing_tier, created_by)
    VALUES
        (org_royal, 'Royal Heritage Events & Planners', 'royal-heritage', 'free', uid_amar),
        (org_vivaah, 'Vivaah Destination Coordinators', 'vivaah-coordinators', 'free', uid_lucky)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        billing_tier = EXCLUDED.billing_tier;

    -- Insert Organisation Members
    INSERT INTO public.organisation_members (organisation_id, user_id, role)
    VALUES
        -- Org A: Amar is Owner, Ananya is Member
        (org_royal, uid_amar, 'owner'),
        (org_royal, uid_ananya, 'member'),
        -- Org B: Lucky is Owner, Omm is Member
        (org_vivaah, uid_lucky, 'owner'),
        (org_vivaah, uid_omm, 'member')
    ON CONFLICT (organisation_id, user_id) DO UPDATE SET
        role = EXCLUDED.role;

    -- Insert Weddings
    INSERT INTO public.weddings (
        id, organisation_id, title, slug, couple_bride_name, couple_groom_name,
        start_date, end_date, primary_city, status, total_budget, created_by
    )
    VALUES
        (
            wed_udaipur, org_royal, 'Aarav & Diya Grand Palace Wedding', 'aarav-diya-udaipur',
            'Diya Sharma', 'Aarav Kapoor', '2026-11-20', '2026-11-23',
            'Udaipur, Rajasthan', 'planning', 4500000.00, uid_amar
        ),
        (
            wed_jaipur, org_royal, 'Rohan & Meera Royal Celebration', 'rohan-meera-jaipur',
            'Meera Patel', 'Rohan Varma', '2026-12-15', '2026-12-18',
            'Jaipur, Rajasthan', 'planning', 3200000.00, uid_amar
        ),
        (
            wed_goa, org_vivaah, 'Kabir & Rhea Beachfront Wedding', 'kabir-rhea-goa',
            'Rhea Deshmukh', 'Kabir Malhotra', '2026-11-28', '2026-12-01',
            'Goa, India', 'planning', 5000000.00, uid_lucky
        )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        total_budget = EXCLUDED.total_budget;

    -- Insert Wedding Staff Scoping
    -- Ananya is coordinator for Udaipur wedding, but NOT assigned to Jaipur wedding
    -- Omm is coordinator for Goa wedding
    INSERT INTO public.wedding_members (wedding_id, user_id, role)
    VALUES
        (wed_udaipur, uid_ananya, 'coordinator'),
        (wed_goa, uid_omm, 'coordinator')
    ON CONFLICT (wedding_id, user_id) DO UPDATE SET
        role = EXCLUDED.role;

END $$;
