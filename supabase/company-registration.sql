-- =====================
-- COMPANY REGISTRATION MODULE
-- Tables for SAS Company Creation Documents
-- =====================

-- Plan type enum
CREATE TYPE company_plan AS ENUM ('free', 'starter', 'business', 'premium');
CREATE TYPE company_reg_status AS ENUM ('draft', 'preview', 'paid', 'completed', 'downloaded');
CREATE TYPE id_type AS ENUM ('CC', 'CE', 'Pasaporte', 'NIT');
CREATE TYPE founder_role AS ENUM ('socio', 'rep_legal_principal', 'rep_legal_suplente', 'junta_presidente', 'junta_vicepresidente', 'junta_miembro');
CREATE TYPE arbitration_type AS ENUM ('derecho', 'equidad');

-- =====================
-- COMPANY REGISTRATIONS
-- =====================

CREATE TABLE company_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Plan & Payment
  plan company_plan DEFAULT 'free',
  payment_status TEXT DEFAULT 'free' CHECK (payment_status IN ('free', 'pending', 'paid')),
  payment_reference TEXT,
  payment_amount DECIMAL(12,2),

  -- Company Info
  company_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bogotá D.C.',
  constitution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  object_description TEXT,
  duration TEXT DEFAULT 'indefinida',

  -- Capital
  authorized_capital DECIMAL(15,2) DEFAULT 1000000,
  subscribed_capital DECIMAL(15,2) DEFAULT 1000000,
  paid_capital DECIMAL(15,2) DEFAULT 1000000,
  share_nominal_value DECIMAL(15,2) DEFAULT 1000,
  total_shares INTEGER DEFAULT 1000,

  -- Arbitration
  arbitration_count INTEGER DEFAULT 1 CHECK (arbitration_count IN (1, 3)),
  arbitration_type arbitration_type DEFAULT 'derecho',

  -- Status
  status company_reg_status DEFAULT 'draft',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for company_registrations
ALTER TABLE company_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" ON company_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations" ON company_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON company_registrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own draft registrations" ON company_registrations
  FOR DELETE USING (auth.uid() = user_id AND status = 'draft');

-- =====================
-- FOUNDERS (Constituyentes/Socios)
-- =====================

CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES company_registrations(id) ON DELETE CASCADE,

  -- Personal Info
  full_name TEXT NOT NULL,
  id_type id_type DEFAULT 'CC',
  id_number TEXT NOT NULL,
  id_expedition_place TEXT DEFAULT 'Bogotá D.C.',
  domicile TEXT DEFAULT 'Bogotá D.C.',

  -- Shares
  share_percentage DECIMAL(5,2) NOT NULL CHECK (share_percentage > 0 AND share_percentage <= 100),
  share_count INTEGER,
  share_value DECIMAL(15,2),

  -- Roles (a founder can have multiple roles stored as array)
  roles founder_role[] DEFAULT '{socio}',

  -- Order for display
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for founders
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view founders of their registrations" ON founders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM company_registrations
      WHERE company_registrations.id = founders.registration_id
      AND company_registrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert founders for their registrations" ON founders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_registrations
      WHERE company_registrations.id = founders.registration_id
      AND company_registrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update founders of their registrations" ON founders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM company_registrations
      WHERE company_registrations.id = founders.registration_id
      AND company_registrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete founders of their registrations" ON founders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM company_registrations
      WHERE company_registrations.id = founders.registration_id
      AND company_registrations.user_id = auth.uid()
    )
  );

-- =====================
-- TRIGGERS
-- =====================

CREATE TRIGGER company_registrations_updated_at
  BEFORE UPDATE ON company_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_company_reg_user ON company_registrations(user_id);
CREATE INDEX idx_company_reg_status ON company_registrations(status);
CREATE INDEX idx_founders_registration ON founders(registration_id);
