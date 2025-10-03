import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, UserPlus, X, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User, Attendance } from '../types/database';

interface AttendanceListProps {
  eventId: string;
  onClose: () => void;
}

export function AttendanceList({ eventId, onClose }: AttendanceListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [attendances, setAttendances] = useState<Map<string, Attendance>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAbsentModal, setShowAbsentModal] = useState<string | null>(null);
  const [excuseReason, setExcuseReason] = useState('');

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, attendancesResponse] = await Promise.all([
        supabase.from('users').select('*').order('surname'),
        supabase.from('attendances').select('*').eq('event_id', eventId)
      ]);

      if (usersResponse.error) {
        console.error('Error loading users:', usersResponse.error);
      } else if (usersResponse.data) {
        setUsers(usersResponse.data);
      }

      if (attendancesResponse.error) {
        console.error('Error loading attendances:', attendancesResponse.error);
      } else if (attendancesResponse.data) {
        const attendanceMap = new Map<string, Attendance>();
        attendancesResponse.data.forEach((att) => {
          if (att.user_id) {
            attendanceMap.set(att.user_id, att);
          }
        });
        setAttendances(attendanceMap);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.surname.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.cell_group && user.cell_group.toLowerCase().includes(searchLower))
    );
  });

  const togglePresent = async (userId: string) => {
    const currentAttendance = attendances.get(userId);

    if (currentAttendance && currentAttendance.present) {
      setShowAbsentModal(userId);
    } else {
      await markPresent(userId);
    }
  };

  const markPresent = async (userId: string) => {
    try {
      const currentAttendance = attendances.get(userId);

      if (currentAttendance) {
        const { data, error } = await supabase
          .from('attendances')
          .update({
            present: true,
            notes: null
          })
          .eq('id', currentAttendance.id)
          .select()
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const newMap = new Map(attendances);
          newMap.set(userId, data);
          setAttendances(newMap);
        }
      } else {
        const user = users.find(u => u.id === userId);
        const { data, error } = await supabase
          .from('attendances')
          .insert({
            user_id: userId,
            event_id: eventId,
            present: true,
            is_first_timer: user?.is_first_timer || false,
            cell_group: user?.cell_group || null
          })
          .select()
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const newMap = new Map(attendances);
          newMap.set(userId, data);
          setAttendances(newMap);
        }
      }
    } catch (error) {
      console.error('Error marking present:', error);
    }
  };

  const markAbsentWithReason = async () => {
    if (!showAbsentModal) return;

    try {
      const currentAttendance = attendances.get(showAbsentModal);

      if (currentAttendance) {
        const { data, error } = await supabase
          .from('attendances')
          .update({
            present: false,
            notes: excuseReason || null
          })
          .eq('id', currentAttendance.id)
          .select()
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const newMap = new Map(attendances);
          newMap.set(showAbsentModal, data);
          setAttendances(newMap);
        }
      } else {
        const user = users.find(u => u.id === showAbsentModal);
        const { data, error } = await supabase
          .from('attendances')
          .insert({
            user_id: showAbsentModal,
            event_id: eventId,
            present: false,
            is_first_timer: user?.is_first_timer || false,
            cell_group: user?.cell_group || null,
            notes: excuseReason || null
          })
          .select()
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const newMap = new Map(attendances);
          newMap.set(showAbsentModal, data);
          setAttendances(newMap);
        }
      }

      setShowAbsentModal(null);
      setExcuseReason('');
    } catch (error) {
      console.error('Error marking absent:', error);
    }
  };

  const markAllPresent = async () => {
    try {
      const promises = users.map(async (user) => {
        const currentAttendance = attendances.get(user.id);

        if (currentAttendance) {
          return supabase
            .from('attendances')
            .update({ present: true, notes: null })
            .eq('id', currentAttendance.id);
        } else {
          return supabase
            .from('attendances')
            .insert({
              user_id: user.id,
              event_id: eventId,
              present: true,
              is_first_timer: user.is_first_timer,
              cell_group: user.cell_group
            });
        }
      });

      await Promise.all(promises);
      await loadData();
    } catch (error) {
      console.error('Error marking all present:', error);
    }
  };

  const presentCount = Array.from(attendances.values()).filter(a => a.present).length;
  const absentCount = Array.from(attendances.values()).filter(a => !a.present).length;
  const notMarkedCount = users.length - attendances.size;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{presentCount}</div>
          <div className="text-sm text-green-600">Present</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{absentCount}</div>
          <div className="text-sm text-red-600">Absent</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{notMarkedCount}</div>
          <div className="text-sm text-gray-600">Not Marked</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{users.length}</div>
          <div className="text-sm text-blue-600">Total</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or cell group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={markAllPresent}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All Present
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} people
        </p>
      )}

      <div className="space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No people found matching your search.' : 'No people in the system.'}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const attendance = attendances.get(user.id);
            const isPresent = attendance?.present;
            const isMarked = !!attendance;

            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => togglePresent(user.id)}
                    className="flex-shrink-0"
                  >
                    {isPresent ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400"></div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {user.name} {user.surname}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {user.phone && <span>{user.phone}</span>}
                      {user.phone && user.cell_group && <span>•</span>}
                      {user.cell_group && <span>{user.cell_group}</span>}
                    </div>
                    {attendance && !attendance.present && attendance.notes && (
                      <div className="flex items-start mt-2 text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded">
                        <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{attendance.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.is_first_timer && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      First Timer
                    </span>
                  )}
                  {isMarked && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isPresent
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isPresent ? 'Present' : 'Absent'}
                    </span>
                  )}
                  {!isMarked && (
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">
                      Not Marked
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAbsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mark as Absent</h3>
              <button
                onClick={() => {
                  setShowAbsentModal(null);
                  setExcuseReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Optionally add a reason for absence (e.g., sick, travel, work):
            </p>
            <textarea
              value={excuseReason}
              onChange={(e) => setExcuseReason(e.target.value)}
              placeholder="Enter excuse or leave blank..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAbsentModal(null);
                  setExcuseReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={markAbsentWithReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Mark Absent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
