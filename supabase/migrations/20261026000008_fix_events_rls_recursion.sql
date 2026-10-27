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
