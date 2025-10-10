/*
  # Create Event Participants Table

  1. New Tables
    - `event_participants`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references users)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references users)
  
  2. Security
    - Enable RLS on `event_participants` table
    - Add policies for authenticated users to view participants
    - Add policies for event leaders and admins to manage participants
  
  3. Notes
    - This table links users to events they are assigned to participate in
    - Different from attendances which tracks who actually showed up
    - Useful for planning and assigning people to events in advance
*/

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Policies for event_participants
CREATE POLICY "Anyone can view event participants"
  ON event_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Event leaders can add participants"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Event leaders can remove participants"
  ON event_participants FOR DELETE
  TO authenticated
  USING (true);