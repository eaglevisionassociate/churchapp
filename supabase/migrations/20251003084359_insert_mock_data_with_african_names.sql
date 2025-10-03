/*
  # Insert Mock Data with African Names
  
  This migration populates the database with realistic mock data
  using African names from various countries and regions.
*/

-- Insert Departments
INSERT INTO departments (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Security', 'Church security and safety team'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Ushers', 'Welcome and seating coordination'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Technicians', 'Audio, visual, and technical equipment'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Worship', 'Music and worship leading'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Children Ministry', 'Sunday school and kids programs');

-- Insert Teams
INSERT INTO teams (id, department_id, name, description) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Sound Team', 'Audio equipment and mixing'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Camera Team', 'Video recording and streaming'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Lighting Team', 'Stage and ambient lighting'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Instruments', 'Musical instruments team'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Vocals', 'Singers and backup vocals');

-- Insert Users with African names
INSERT INTO users (id, email, name, surname, phone, role, pin, department_id, cell_group) VALUES
  -- Admins
  ('770e8400-e29b-41d4-a716-446655440001', 'admin1@cfcpretoriaeast.org', 'Thabo', 'Mthembu', '+27123456789', 'admin', '1001', NULL, 'Leadership'),
  ('770e8400-e29b-41d4-a716-446655440002', 'admin2@cfcpretoriaeast.org', 'Nomsa', 'Dlamini', '+27123456790', 'admin', '1002', NULL, 'Leadership'),
  
  -- Department Leaders
  ('770e8400-e29b-41d4-a716-446655440003', 'security.lead@cfcpretoriaeast.org', 'Sipho', 'Ndlovu', '+27123456791', 'department_leader', '2001', '550e8400-e29b-41d4-a716-446655440001', 'Men Fellowship'),
  ('770e8400-e29b-41d4-a716-446655440004', 'ushers.lead@cfcpretoriaeast.org', 'Zanele', 'Khumalo', '+27123456792', 'department_leader', '2002', '550e8400-e29b-41d4-a716-446655440002', 'Women Fellowship'),
  ('770e8400-e29b-41d4-a716-446655440005', 'tech.lead@cfcpretoriaeast.org', 'Mandla', 'Mokoena', '+27123456793', 'department_leader', '2003', '550e8400-e29b-41d4-a716-446655440003', 'Youth'),
  ('770e8400-e29b-41d4-a716-446655440006', 'worship.lead@cfcpretoriaeast.org', 'Precious', 'Mahlangu', '+27123456794', 'department_leader', '2004', '550e8400-e29b-41d4-a716-446655440004', 'Worship Team'),
  
  -- Event Leaders
  ('770e8400-e29b-41d4-a716-446655440007', 'events@cfcpretoriaeast.org', 'Bongani', 'Sithole', '+27123456795', 'event_leader', '3001', NULL, 'Events Team'),
  
  -- Team Members - Security
  ('770e8400-e29b-41d4-a716-446655440008', 'security1@cfcpretoriaeast.org', 'Themba', 'Zulu', '+27123456796', 'member', '4001', '550e8400-e29b-41d4-a716-446655440001', 'Men Fellowship'),
  ('770e8400-e29b-41d4-a716-446655440009', 'security2@cfcpretoriaeast.org', 'Lucky', 'Mabaso', '+27123456797', 'member', '4002', '550e8400-e29b-41d4-a716-446655440001', 'Men Fellowship'),
  
  -- Team Members - Ushers
  ('770e8400-e29b-41d4-a716-446655440010', 'usher1@cfcpretoriaeast.org', 'Nomthandazo', 'Ngcobo', '+27123456798', 'member', '4003', '550e8400-e29b-41d4-a716-446655440002', 'Women Fellowship'),
  ('770e8400-e29b-41d4-a716-446655440011', 'usher2@cfcpretoriaeast.org', 'Sibongile', 'Radebe', '+27123456799', 'member', '4004', '550e8400-e29b-41d4-a716-446655440002', 'Women Fellowship'),
  ('770e8400-e29b-41d4-a716-446655440012', 'usher3@cfcpretoriaeast.org', 'Thandiwe', 'Cele', '+27123456800', 'member', '4005', '550e8400-e29b-41d4-a716-446655440002', 'Young Adults'),
  
  -- Team Members - Technicians
  ('770e8400-e29b-41d4-a716-446655440013', 'sound1@cfcpretoriaeast.org', 'Nkosana', 'Mbeki', '+27123456801', 'member', '4006', '550e8400-e29b-41d4-a716-446655440003', 'Youth'),
  ('770e8400-e29b-41d4-a716-446655440014', 'camera1@cfcpretoriaeast.org', 'Lerato', 'Molefe', '+27123456802', 'member', '4007', '550e8400-e29b-41d4-a716-446655440003', 'Young Adults'),
  ('770e8400-e29b-41d4-a716-446655440015', 'lighting1@cfcpretoriaeast.org', 'Mpho', 'Tshwane', '+27123456803', 'member', '4008', '550e8400-e29b-41d4-a716-446655440003', 'Youth'),
  
  -- Team Members - Worship
  ('770e8400-e29b-41d4-a716-446655440016', 'worship1@cfcpretoriaeast.org', 'Naledi', 'Mokwena', '+27123456804', 'member', '4009', '550e8400-e29b-41d4-a716-446655440004', 'Worship Team'),
  ('770e8400-e29b-41d4-a716-446655440017', 'worship2@cfcpretoriaeast.org', 'Kagiso', 'Lekota', '+27123456805', 'member', '4010', '550e8400-e29b-41d4-a716-446655440004', 'Worship Team'),
  
  -- Regular Members
  ('770e8400-e29b-41d4-a716-446655440018', 'member1@cfcpretoriaeast.org', 'Busisiwe', 'Nkomo', '+27123456806', 'member', '5001', NULL, 'Cell Group A'),
  ('770e8400-e29b-41d4-a716-446655440019', 'member2@cfcpretoriaeast.org', 'Sizani', 'Mthethwa', '+27123456807', 'member', '5002', NULL, 'Cell Group B'),
  ('770e8400-e29b-41d4-a716-446655440020', 'member3@cfcpretoriaeast.org', 'Nomsa', 'Vilakazi', '+27123456808', 'member', '5003', NULL, 'Cell Group C'),
  
  -- First-time visitors
  ('770e8400-e29b-41d4-a716-446655440021', 'visitor1@example.com', 'Amahle', 'Zungu', '+27123456809', 'member', NULL, NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440022', 'visitor2@example.com', 'Lwazi', 'Maseko', '+27123456810', 'member', NULL, NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440023', 'visitor3@example.com', 'Nosipho', 'Gumede', '+27123456811', 'member', NULL, NULL, NULL);

-- Mark some users as first-timers
UPDATE users SET is_first_timer = true 
WHERE id IN ('770e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440023');

-- Insert Events
INSERT INTO events (id, title, type, event_date, event_time, location, description, created_by) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'Sunday Morning Service', 'sunday_service', '2024-01-07', '09:00:00', 'Main Sanctuary', 'Weekly Sunday morning worship service', '770e8400-e29b-41d4-a716-446655440001'),
  ('880e8400-e29b-41d4-a716-446655440002', 'Sunday Evening Service', 'sunday_service', '2024-01-07', '18:00:00', 'Main Sanctuary', 'Sunday evening service', '770e8400-e29b-41d4-a716-446655440001'),
  ('880e8400-e29b-41d4-a716-446655440003', 'Cell Group A Meeting', 'cell_group', '2024-01-10', '19:00:00', 'Room 101', 'Weekly cell group meeting', '770e8400-e29b-41d4-a716-446655440007'),
  ('880e8400-e29b-41d4-a716-446655440004', 'Youth Service', 'custom', '2024-01-12', '18:30:00', 'Youth Hall', 'Monthly youth gathering', '770e8400-e29b-41d4-a716-446655440007'),
  ('880e8400-e29b-41d4-a716-446655440005', 'Prayer Meeting', 'custom', '2024-01-15', '06:00:00', 'Prayer Room', 'Early morning prayer', '770e8400-e29b-41d4-a716-446655440001');

-- Insert Attendances
INSERT INTO attendances (user_id, event_id, present, is_first_timer, cell_group, marked_by) VALUES
  -- Sunday Morning Service attendances
  ('770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Leadership', '770e8400-e29b-41d4-a716-446655440001'),
  ('770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Men Fellowship', '770e8400-e29b-41d4-a716-446655440001'),
  ('770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Women Fellowship', '770e8400-e29b-41d4-a716-446655440001'),
  ('770e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Women Fellowship', '770e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440016', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Worship Team', '770e8400-e29b-41d4-a716-446655440006'),
  ('770e8400-e29b-41d4-a716-446655440018', '880e8400-e29b-41d4-a716-446655440001', true, false, 'Cell Group A', '770e8400-e29b-41d4-a716-446655440004'),
  
  -- First-timer attendances
  ('770e8400-e29b-41d4-a716-446655440021', '880e8400-e29b-41d4-a716-446655440001', true, true, NULL, '770e8400-e29b-41d4-a716-446655440004'),
  ('770e8400-e29b-41d4-a716-446655440022', '880e8400-e29b-41d4-a716-446655440001', true, true, NULL, '770e8400-e29b-41d4-a716-446655440004'),
  
  -- Cell Group attendances
  ('770e8400-e29b-41d4-a716-446655440018', '880e8400-e29b-41d4-a716-446655440003', true, false, 'Cell Group A', '770e8400-e29b-41d4-a716-446655440007'),
  ('770e8400-e29b-41d4-a716-446655440019', '880e8400-e29b-41d4-a716-446655440003', true, false, 'Cell Group A', '770e8400-e29b-41d4-a716-446655440007');

-- Insert Equipment Checklists
INSERT INTO checklists (team_id, event_id, equipment_name, is_working, remarks, checked_by) VALUES
  -- Sound Team checklist for Sunday Morning Service
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Main Mixing Console', true, 'All channels working properly', '770e8400-e29b-41d4-a716-446655440013'),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Wireless Microphones', true, 'All 6 mics tested and working', '770e8400-e29b-41d4-a716-446655440013'),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Main Speakers', true, 'Sound quality excellent', '770e8400-e29b-41d4-a716-446655440013'),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Monitor Speakers', false, 'Left monitor has crackling sound', '770e8400-e29b-41d4-a716-446655440013'),
  
  -- Camera Team checklist
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'Main Camera', true, 'Recording in 4K, battery full', '770e8400-e29b-41d4-a716-446655440014'),
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'Side Camera', true, 'Positioned for worship team shots', '770e8400-e29b-41d4-a716-446655440014'),
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'Streaming Equipment', true, 'Live stream active on YouTube', '770e8400-e29b-41d4-a716-446655440014'),
  
  -- Lighting Team checklist
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'Stage Lights', true, 'All LED panels working', '770e8400-e29b-41d4-a716-446655440015'),
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'Spotlight', true, 'Focused on pulpit area', '770e8400-e29b-41d4-a716-446655440015'),
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'Ambient Lighting', false, 'Two bulbs need replacement', '770e8400-e29b-41d4-a716-446655440015');

-- Insert Permissions for department leaders
INSERT INTO permissions (user_id, can_view, can_edit, can_delete) VALUES
  ('770e8400-e29b-41d4-a716-446655440003', '{"attendances": true, "users": "department", "events": true}'::jsonb, '{"attendances": true, "checklists": true}'::jsonb, '{}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440004', '{"attendances": true, "users": "department", "events": true}'::jsonb, '{"attendances": true}'::jsonb, '{}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440005', '{"attendances": true, "users": "department", "events": true, "checklists": true}'::jsonb, '{"attendances": true, "checklists": true}'::jsonb, '{}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440006', '{"attendances": true, "users": "department", "events": true}'::jsonb, '{"attendances": true}'::jsonb, '{}'::jsonb);

-- Insert First Timer Call Records
INSERT INTO first_timer_calls (user_id, called_by, call_status, notes) VALUES
  ('770e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440004', 'connected', 'Welcomed Amahle, she enjoyed the service and wants to join Cell Group A'),
  ('770e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440004', 'no_answer', 'Left voicemail, will try again tomorrow'),
  ('770e8400-e29b-41d4-a716-446655440023', '770e8400-e29b-41d4-a716-446655440001', 'follow_up_needed', 'Interested in baptism classes, scheduled meeting for next week');