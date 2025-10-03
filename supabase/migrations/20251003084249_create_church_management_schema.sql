/*
  # Church Management System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `surname` (text)
      - `phone` (text, optional)
      - `role` (text) - admin, department_leader, event_leader, member, view_only
      - `pin` (text, optional) - for quick check-in
      - `department_id` (uuid, optional foreign key)
      - `is_first_timer` (boolean, default false)
      - `cell_group` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `departments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `created_at` (timestamptz)

    - `teams`
      - `id` (uuid, primary key)
      - `department_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text, optional)
      - `created_at` (timestamptz)

    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - sunday_service, cell_group, custom
      - `event_date` (date)
      - `event_time` (time)
      - `location` (text, optional)
      - `description` (text, optional)
      - `created_by` (uuid, optional foreign key)
      - `created_at` (timestamptz)

    - `attendances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional foreign key)
      - `event_id` (uuid, foreign key)
      - `present` (boolean, default true)
      - `is_first_timer` (boolean, default false)
      - `cell_group` (text, optional)
      - `notes` (text, optional) - for excuse reasons
      - `marked_by` (uuid, optional foreign key)
      - `created_at` (timestamptz)

    - `checklists`
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key)
      - `event_id` (uuid, foreign key)
      - `equipment_name` (text)
      - `is_working` (boolean, default true)
      - `remarks` (text, optional)
      - `checked_by` (uuid, optional foreign key)
      - `created_at` (timestamptz)

    - `permissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `can_view` (jsonb)
      - `can_edit` (jsonb)
      - `can_delete` (jsonb)
      - `created_at` (timestamptz)

    - `first_timer_calls`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `called_by` (uuid, optional foreign key)
      - `call_date` (date, default now)
      - `call_status` (text) - attempted, connected, no_answer, follow_up_needed
      - `notes` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their relevant data
    - Admin users can access all data
    - Department leaders can access their department data
    - Event leaders can manage events and attendances

  3. Important Notes
    - The `attendances.notes` field stores excuse reasons for absent members
    - The `attendances.present` field indicates if user is present (true) or absent (false)
    - Users not marked at all are considered absent
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  surname text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('admin', 'department_leader', 'event_leader', 'member', 'view_only')),
  pin text,
  department_id uuid REFERENCES departments(id),
  is_first_timer boolean DEFAULT false,
  cell_group text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
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

-- Create attendances table
CREATE TABLE IF NOT EXISTS attendances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  present boolean DEFAULT true,
  is_first_timer boolean DEFAULT false,
  cell_group text,
  notes text,
  marked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create checklists table
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

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_view jsonb DEFAULT '{}'::jsonb,
  can_edit jsonb DEFAULT '{}'::jsonb,
  can_delete jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create first_timer_calls table
CREATE TABLE IF NOT EXISTS first_timer_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  called_by uuid REFERENCES users(id),
  call_date date DEFAULT CURRENT_DATE,
  call_status text NOT NULL CHECK (call_status IN ('attempted', 'connected', 'no_answer', 'follow_up_needed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_timer_calls ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Anyone can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins and users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Teams policies
CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Department leaders and admins can manage teams"
  ON teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR (users.role = 'department_leader' AND users.department_id = teams.department_id))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR (users.role = 'department_leader' AND users.department_id = teams.department_id))
    )
  );

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Event leaders and admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  );

CREATE POLICY "Event leaders and admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  );

-- Attendances policies
CREATE POLICY "Anyone can view attendances"
  ON attendances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authorized users can mark attendance"
  ON attendances FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  );

CREATE POLICY "Authorized users can update attendance"
  ON attendances FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  );

CREATE POLICY "Authorized users can delete attendance"
  ON attendances FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'event_leader', 'department_leader')
    )
  );

-- Checklists policies
CREATE POLICY "Anyone can view checklists"
  ON checklists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can manage checklists"
  ON checklists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'department_leader', 'member')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'department_leader', 'member')
    )
  );

-- Permissions policies
CREATE POLICY "Users can view own permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage permissions"
  ON permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- First timer calls policies
CREATE POLICY "Anyone can view first timer calls"
  ON first_timer_calls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authorized users can manage first timer calls"
  ON first_timer_calls FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'department_leader', 'event_leader')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'department_leader', 'event_leader')
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_attendances_event ON attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user ON attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_event ON checklists(event_id);
CREATE INDEX IF NOT EXISTS idx_checklists_team ON checklists(team_id);