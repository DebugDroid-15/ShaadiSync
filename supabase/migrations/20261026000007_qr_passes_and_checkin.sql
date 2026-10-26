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

