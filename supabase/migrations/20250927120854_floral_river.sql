/*
  # Church Management System Database Schema

  1. New Tables
    - `users` - Church members, leaders, and admins with roles and PINs
    - `departments` - Church departments (Security, Ushers, Technicians, etc.)
    - `teams` - Sub-teams within departments
    - `events` - Church events (Sunday service, cell groups, custom events)
    - `attendances` - Track who attended which events
    - `checklists` - Equipment checklists for technicians
    - `permissions` - Role-based access control
    - `first_timer_calls` - Track follow-up calls to first-time visitors

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can see everything
    - Department leaders can only see their department data
    - Regular users can only see their own data

  3. Features
    - PIN-based access control
    - Flexible event management
    - Equipment tracking
    - First-timer follow-up system
    - Comprehensive reporting structure
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  surname text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'department_leader', 'event_leader', 'member', 'view_only')),
  pin text UNIQUE,
  department_id uuid REFERENCES departments(id),
  is_first_timer boolean DEFAULT false,
  cell_group text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Teams table (sub-teams within departments)
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('sunday_service', 'cell_group', 'custom')),
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Attendances table
CREATE TABLE IF NOT EXISTS attendances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  present boolean DEFAULT true,
  is_first_timer boolean DEFAULT false,
  cell_group text,
  notes text,
  marked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Equipment checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  equipment_name text NOT NULL,
  is_working boolean DEFAULT true,
  remarks text,
  checked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Permissions table for fine-grained access control
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_view jsonb DEFAULT '{}',
  can_edit jsonb DEFAULT '{}',
  can_delete jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- First timer calls tracking
CREATE TABLE IF NOT EXISTS first_timer_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  called_by uuid REFERENCES users(id),
  call_date timestamptz DEFAULT now(),
  call_status text CHECK (call_status IN ('attempted', 'connected', 'no_answer', 'follow_up_needed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_timer_calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Admins can see all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Department leaders can see their department users"
  ON users FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE id = auth.uid() AND role = 'department_leader'
    )
  );

CREATE POLICY "Users can see their own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- RLS Policies for departments table
CREATE POLICY "Everyone can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for teams table
CREATE POLICY "Everyone can view teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and department leaders can modify teams"
  ON teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = auth.uid() 
      AND (u.role = 'admin' OR (u.role = 'department_leader' AND d.id = department_id))
    )
  );

-- RLS Policies for events table
CREATE POLICY "Everyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and event leaders can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'event_leader')
    )
  );

-- RLS Policies for attendances table
CREATE POLICY "Users can view attendances they're involved in"
  ON attendances FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    marked_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'department_leader', 'event_leader')
    )
  );

CREATE POLICY "Authorized users can mark attendance"
  ON attendances FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'department_leader', 'event_leader')
    )
  );

-- RLS Policies for checklists table
CREATE POLICY "Team members can view their team checklists"
  ON checklists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN teams t ON u.department_id = t.department_id
      WHERE u.id = auth.uid() AND t.id = team_id
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Team members can create checklists"
  ON checklists FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN teams t ON u.department_id = t.department_id
      WHERE u.id = auth.uid() AND t.id = team_id
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for permissions table
CREATE POLICY "Admins can manage all permissions"
  ON permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for first_timer_calls table
CREATE POLICY "Users can view calls they made or received"
  ON first_timer_calls FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    called_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'department_leader')
    )
  );

CREATE POLICY "Authorized users can log calls"
  ON first_timer_calls FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'department_leader', 'event_leader')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_pin ON users(pin);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_attendances_event ON attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user ON attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_checklists_team_event ON checklists(team_id, event_id);