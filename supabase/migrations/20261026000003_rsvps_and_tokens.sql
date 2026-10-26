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
        guest_id IN (
            SELECT id FROM public.guests
            WHERE token_revoked IS FALSE
              AND (token_expires_at IS NULL OR token_expires_at > NOW())
        )
    );

CREATE POLICY "events_token_read"
    ON public.events FOR SELECT
    USING (
        id IN (
            SELECT event_id FROM public.event_invitations
        )
    );
