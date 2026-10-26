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

