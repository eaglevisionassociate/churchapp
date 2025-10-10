export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  role: 'admin' | 'department_leader' | 'event_leader' | 'member' | 'view_only';
  pin?: string;
  department_id?: string;
  is_first_timer: boolean;
  cell_group?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Team {
  id: string;
  department_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'sunday_service' | 'cell_group' | 'custom';
  event_date: string;
  event_time: string;
  location?: string;
  description?: string;
  created_by?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id?: string;
  event_id: string;
  present: boolean;
  is_first_timer: boolean;
  cell_group?: string;
  notes?: string;
  marked_by?: string;
  created_at: string;
  user?: User;
}

export interface Checklist {
  id: string;
  team_id: string;
  event_id: string;
  equipment_name: string;
  is_working: boolean;
  remarks?: string;
  checked_by?: string;
  created_at: string;
  team?: Team;
  checker?: User;
}

export interface Permission {
  id: string;
  user_id: string;
  can_view: Record<string, any>;
  can_edit: Record<string, any>;
  can_delete: Record<string, any>;
  created_at: string;
}

export interface FirstTimerCall {
  id: string;
  user_id: string;
  called_by?: string;
  call_date: string;
  call_status: 'attempted' | 'connected' | 'no_answer' | 'follow_up_needed';
  notes?: string;
  created_at: string;
  user?: User;
  caller?: User;
}