-- =====================================================================
-- Migration: 008_fix_events_rls_recursion.sql
-- Description: Fix infinite recursion between public.events and public.event_invitations
--              in Row Level Security policies.
-- =====================================================================

-- 1. Create a security-definer helper function to check guest event access via invitation token
-- Using SECURITY DEFINER bypasses RLS on event_invitations and guests, preventing any recursion!
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

-- 2. Drop the recursive policy on public.events
DROP POLICY IF EXISTS "events_token_read" ON public.events;

-- 3. Recreate events_token_read policy using the security-definer function
CREATE POLICY "events_token_read"
    ON public.events FOR SELECT
    USING (public.can_guest_access_event(id));

-- 4. Also optimize event_invitations_token_read to use guest token validation directly
DROP POLICY IF EXISTS "event_invitations_token_read" ON public.event_invitations;

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
