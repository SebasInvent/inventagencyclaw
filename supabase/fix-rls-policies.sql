-- FIX RLS POLICIES - Ejecutar en Supabase SQL Editor
-- Este script corrige las políticas de seguridad para permitir el acceso correcto

-- =====================
-- PROFILES - Permitir que usuarios lean su propio perfil
-- =====================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Professionals can view client profiles" ON profiles;

-- Crear políticas más permisivas
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Professionals can view profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professional', 'admin'))
  );

-- =====================
-- PROJECTS - Permitir acceso a proyectos
-- =====================

DROP POLICY IF EXISTS "Clients can view their own projects" ON projects;
DROP POLICY IF EXISTS "Professionals can view assigned projects" ON projects;
DROP POLICY IF EXISTS "Clients can create projects" ON projects;
DROP POLICY IF EXISTS "Professionals can update projects" ON projects;

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Professionals can view assigned" ON projects
  FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Professionals can update assigned" ON projects
  FOR UPDATE USING (auth.uid() = assigned_to);

-- =====================
-- DISCOVERY_CALLS - Permitir acceso a calls
-- =====================

DROP POLICY IF EXISTS "Users can view their own calls" ON discovery_calls;
DROP POLICY IF EXISTS "Clients can create calls" ON discovery_calls;
DROP POLICY IF EXISTS "Professionals can update calls" ON discovery_calls;

CREATE POLICY "Users can view own calls" ON discovery_calls
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = professional_id);

CREATE POLICY "Users can create calls" ON discovery_calls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all calls" ON discovery_calls
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Professionals can update calls" ON discovery_calls
  FOR UPDATE USING (auth.uid() = professional_id);

-- =====================
-- INVOICES - Permitir acceso a facturas
-- =====================

DROP POLICY IF EXISTS "Clients can view their invoices" ON invoices;
DROP POLICY IF EXISTS "Professionals can manage invoices" ON invoices;

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professional', 'admin'))
  );

-- =====================
-- QUOTATIONS - Permitir crear cotizaciones sin autenticación
-- =====================

DROP POLICY IF EXISTS "Anyone can create quotations" ON quotations;
DROP POLICY IF EXISTS "Users can view their quotations" ON quotations;

CREATE POLICY "Anyone can create quotations" ON quotations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view quotations" ON quotations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================
-- MESSAGES - Permitir acceso a mensajes
-- =====================

DROP POLICY IF EXISTS "Project participants can view messages" ON messages;
DROP POLICY IF EXISTS "Project participants can send messages" ON messages;

CREATE POLICY "Users can view project messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Users can send project messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    )
  );

-- =====================
-- DELIVERABLES - Permitir acceso a entregables
-- =====================

DROP POLICY IF EXISTS "Project participants can view deliverables" ON deliverables;

CREATE POLICY "Users can view project deliverables" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = deliverables.project_id 
      AND (projects.client_id = auth.uid() OR projects.assigned_to = auth.uid())
    )
  );

-- =====================
-- VERIFICAR
-- =====================

SELECT 'Políticas RLS actualizadas correctamente!' as message;
