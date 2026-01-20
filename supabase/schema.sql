-- InventAgency Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ENUMS
-- =====================

CREATE TYPE user_role AS ENUM ('client', 'professional', 'admin');
CREATE TYPE project_status AS ENUM ('draft', 'quoted', 'in_progress', 'review', 'completed', 'cancelled');
CREATE TYPE project_type AS ENUM ('mobile', 'web', 'api', 'ai', 'blockchain', 'biometrics', 'analytics', 'ecommerce', 'enterprise', 'other');
CREATE TYPE complexity_level AS ENUM ('basic', 'intermediate', 'advanced');
CREATE TYPE timeline_type AS ENUM ('express', 'standard', 'flexible');
CREATE TYPE call_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- =====================
-- PROFILES (extends auth.users)
-- =====================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  role user_role DEFAULT 'client',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Professionals can view client profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professional', 'admin')
    )
  );

-- =====================
-- PROJECTS
-- =====================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id),
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  project_type project_type NOT NULL,
  complexity complexity_level NOT NULL,
  timeline timeline_type NOT NULL,
  
  -- Pricing
  estimated_price_min DECIMAL(10,2),
  estimated_price_max DECIMAL(10,2),
  final_price DECIMAL(10,2),
  
  -- Status & Progress
  status project_status DEFAULT 'draft',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Dates
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  
  -- Metadata
  features JSONB DEFAULT '[]',
  tech_stack JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Professionals can view assigned projects" ON projects
  FOR SELECT USING (
    auth.uid() = assigned_to OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professional', 'admin'))
  );

CREATE POLICY "Clients can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Professionals can update projects" ON projects
  FOR UPDATE USING (
    auth.uid() = assigned_to OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================
-- DISCOVERY CALLS
-- =====================

CREATE TABLE discovery_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES profiles(id),
  project_id UUID REFERENCES projects(id),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'America/Bogota',
  
  -- Status
  status call_status DEFAULT 'scheduled',
  
  -- Meeting details
  meeting_url TEXT,
  notes TEXT,
  recording_url TEXT,
  
  -- Questionnaire responses
  questionnaire_responses JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for discovery_calls
ALTER TABLE discovery_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calls" ON discovery_calls
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = professional_id);

CREATE POLICY "Clients can create calls" ON discovery_calls
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Professionals can update calls" ON discovery_calls
  FOR UPDATE USING (
    auth.uid() = professional_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================
-- MESSAGES
-- =====================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  
  -- For file messages
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Project participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    )
  );

-- =====================
-- DELIVERABLES
-- =====================

CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Files
  files JSONB DEFAULT '[]',
  
  -- Order
  order_index INTEGER DEFAULT 0,
  
  due_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for deliverables
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project participants can view deliverables" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = deliverables.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    )
  );

-- =====================
-- INVOICES
-- =====================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status invoice_status DEFAULT 'draft',
  
  -- Dates
  issued_at TIMESTAMPTZ,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  
  -- Payment
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Items
  items JSONB DEFAULT '[]',
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their invoices" ON invoices
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Professionals can manage invoices" ON invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professional', 'admin'))
  );

-- =====================
-- QUOTATIONS (from the quoter)
-- =====================

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Can be anonymous or linked to user
  user_id UUID REFERENCES profiles(id),
  email TEXT,
  
  -- Selections
  project_type project_type NOT NULL,
  complexity complexity_level NOT NULL,
  timeline timeline_type NOT NULL,
  
  -- Calculated estimate
  estimated_min DECIMAL(10,2),
  estimated_max DECIMAL(10,2),
  
  -- Conversion
  converted_to_call BOOLEAN DEFAULT false,
  converted_to_project BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for quotations
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create quotations" ON quotations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their quotations" ON quotations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER discovery_calls_updated_at
  BEFORE UPDATE ON discovery_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_assigned ON projects(assigned_to);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_messages_project ON messages(project_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_discovery_calls_client ON discovery_calls(client_id);
CREATE INDEX idx_discovery_calls_scheduled ON discovery_calls(scheduled_at);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
