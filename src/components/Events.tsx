import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle, Search, UserPlus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  cell_group: string | null;
}

interface EventParticipant {
  id: string;
  user_id: string;
  user?: Member;
}

interface MockAttendee {
  id: string;
  name: string;
  surname: string;
  phone: string;
  cellGroup: string | null;
  isFirstTimer: boolean;
  present: boolean;
}

export function Events() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [mockAttendees, setMockAttendees] = useState<MockAttendee[]>([
    { id: '1', name: 'Thabo', surname: 'Mthembu', phone: '+27123456789', cellGroup: 'Leadership', isFirstTimer: false, present: true },
    { id: '2', name: 'Nomsa', surname: 'Dlamini', phone: '+27123456790', cellGroup: 'Leadership', isFirstTimer: false, present: true },
    { id: '3', name: 'Sipho', surname: 'Ndlovu', phone: '+27123456791', cellGroup: 'Men Fellowship', isFirstTimer: false, present: true },
    { id: '4', name: 'Amahle', surname: 'Zungu', phone: '+27123456809', cellGroup: null, isFirstTimer: true, present: true },
    { id: '5', name: 'Zanele', surname: 'Khumalo', phone: '+27123456792', cellGroup: 'Women Fellowship', isFirstTimer: false, present: true },
    { id: '6', name: 'Mandla', surname: 'Mokoena', phone: '+27123456793', cellGroup: 'Youth', isFirstTimer: false, present: false },
    { id: '7', name: 'Precious', surname: 'Mahlangu', phone: '+27123456794', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
    { id: '8', name: 'Bongani', surname: 'Sithole', phone: '+27123456795', cellGroup: 'Events Team', isFirstTimer: false, present: false },
    { id: '9', name: 'Themba', surname: 'Zulu', phone: '+27123456796', cellGroup: 'Men Fellowship', isFirstTimer: false, present: true },
    { id: '10', name: 'Nomthandazo', surname: 'Ngcobo', phone: '+27123456798', cellGroup: 'Women Fellowship', isFirstTimer: false, present: true },
    { id: '11', name: 'Sibongile', surname: 'Radebe', phone: '+27123456799', cellGroup: 'Women Fellowship', isFirstTimer: false, present: false },
    { id: '12', name: 'Thandiwe', surname: 'Cele', phone: '+27123456800', cellGroup: 'Young Adults', isFirstTimer: false, present: true },
    { id: '13', name: 'Nkosana', surname: 'Mbeki', phone: '+27123456801', cellGroup: 'Youth', isFirstTimer: false, present: true },
    { id: '14', name: 'Lerato', surname: 'Molefe', phone: '+27123456802', cellGroup: 'Young Adults', isFirstTimer: false, present: false },
    { id: '15', name: 'Naledi', surname: 'Mokwena', phone: '+27123456804', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
    { id: '16', name: 'Busisiwe', surname: 'Nkomo', phone: '+27123456806', cellGroup: 'Cell Group A', isFirstTimer: false, present: true },
    { id: '17', name: 'Sizani', surname: 'Mthethwa', phone: '+27123456807', cellGroup: 'Cell Group B', isFirstTimer: false, present: false },
    { id: '18', name: 'Lwazi', surname: 'Maseko', phone: '+27123456810', cellGroup: null, isFirstTimer: true, present: true },
    { id: '19', name: 'Nosipho', surname: 'Gumede', phone: '+27123456811', cellGroup: null, isFirstTimer: true, present: false },
    { id: '20', name: 'Kagiso', surname: 'Lekota', phone: '+27123456805', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
  ]);

  useEffect(() => {
    loadEvents();
    loadMembers();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadParticipants(selectedEvent);
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, surname, email, phone, cell_group')
        .order('name');

      if (error) throw error;
      setAllMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadParticipants = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          id,
          user_id,
          user:users(id, name, surname, email, phone, cell_group)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const newEvent = {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      event_date: formData.get('date') as string,
      event_time: formData.get('time') as string,
      location: formData.get('location') as string || null,
      description: formData.get('description') as string || null,
    };

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()
        .single();

      if (error) throw error;

      await loadEvents();
      setShowAddEvent(false);
      setSelectedEvent(data.id);
      setShowAddParticipants(true);
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert('Error creating event: ' + error.message);
    }
  };

  const handleAddParticipants = async () => {
    if (!selectedEvent || selectedMembers.length === 0) return;

    try {
      const participantsData = selectedMembers.map(userId => ({
        event_id: selectedEvent,
        user_id: userId,
      }));

      const { error } = await supabase
        .from('event_participants')
        .insert(participantsData);

      if (error) throw error;

      await loadParticipants(selectedEvent);
      setSelectedMembers([]);
      setMemberSearchTerm('');
      setShowAddParticipants(false);
    } catch (error: any) {
      console.error('Error adding participants:', error);
      alert('Error adding participants: ' + error.message);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      if (selectedEvent) {
        await loadParticipants(selectedEvent);
      }
    } catch (error: any) {
      console.error('Error removing participant:', error);
      alert('Error removing participant: ' + error.message);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredMembers = allMembers.filter(member => {
    const searchLower = memberSearchTerm.toLowerCase();
    const alreadyAdded = participants.some(p => p.user_id === member.id);
    return !alreadyAdded && (
      member.name.toLowerCase().includes(searchLower) ||
      member.surname.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      (member.cell_group && member.cell_group.toLowerCase().includes(searchLower))
    );
  });

  const filteredAttendees = mockAttendees.filter(attendee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(searchLower) ||
      attendee.surname.toLowerCase().includes(searchLower) ||
      attendee.phone.includes(searchTerm) ||
      (attendee.cellGroup && attendee.cellGroup.toLowerCase().includes(searchLower))
    );
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sunday_service':
        return 'bg-blue-100 text-blue-800';
      case 'cell_group':
        return 'bg-green-100 text-green-800';
      case 'custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAttendance = (attendeeId: string) => {
    setMockAttendees(prevAttendees =>
      prevAttendees.map(attendee =>
        attendee.id === attendeeId
          ? { ...attendee, present: !attendee.present }
          : attendee
      )
    );
    setShowQuickMenu(null);
  };

  const markAsAbsent = (attendeeId: string) => {
    setMockAttendees(prevAttendees =>
      prevAttendees.map(attendee =>
        attendee.id === attendeeId
          ? { ...attendee, present: false }
          : attendee
      )
    );
    setShowQuickMenu(null);
  };

  const markAsPresent = (attendeeId: string) => {
    setMockAttendees(prevAttendees =>
      prevAttendees.map(attendee =>
        attendee.id === attendeeId
          ? { ...attendee, present: true }
          : attendee
      )
    );
    setShowQuickMenu(null);
  };

  const editAttendee = (attendeeId: string) => {
    console.log(`Editing attendee ${attendeeId}`);
    setShowQuickMenu(null);
  };

  const addNewAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newAttendee = {
      id: String(mockAttendees.length + 1),
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      surname: (form.elements.namedItem('surname') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      cellGroup: (form.elements.namedItem('cellGroup') as HTMLSelectElement).value || null,
      isFirstTimer: (form.elements.namedItem('firstTimer') as HTMLInputElement).checked,
      present: true
    };

    setMockAttendees(prev => [...prev, newAttendee]);
    setShowAddAttendee(false);
  };

  const presentCount = mockAttendees.filter(a => a.present).length;
  const absentCount = mockAttendees.length - presentCount;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) return null;

    const eventDate = new Date(event.event_date).toLocaleDateString();
    const eventTime = event.event_time;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedEvent(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {eventDate}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {eventTime}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                {event.type.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Assigned Participants ({participants.length})
              </h3>
              <button
                onClick={() => setShowAddParticipants(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Participants
              </button>
            </div>

            <div className="space-y-2">
              {participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No participants assigned yet.
                </div>
              ) : (
                participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.user?.name} {participant.user?.surname}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{participant.user?.email}</span>
                        {participant.user?.phone && (
                          <>
                            <span>•</span>
                            <span>{participant.user?.phone}</span>
                          </>
                        )}
                        {participant.user?.cell_group && (
                          <>
                            <span>•</span>
                            <span>{participant.user?.cell_group}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove participant"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{presentCount}</div>
              <div className="text-sm text-green-600">Present</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{absentCount}</div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{mockAttendees.length}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Attendance ({filteredAttendees.length} of {mockAttendees.length})
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddAttendee(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Attendee
                </button>
                <button
                  onClick={() => {
                    setMockAttendees(prev => prev.map(a => ({ ...a, present: true })));
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Present
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, surname, phone, or cell group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-600">
                  Showing {filteredAttendees.length} of {mockAttendees.length} attendees
                </p>
              )}
            </div>

            <div className="space-y-3">
              {filteredAttendees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No attendees found matching your search.' : 'No attendees marked yet.'}
                </div>
              ) : (
                filteredAttendees.map((attendee) => (
                  <div key={attendee.id} className="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleAttendance(attendee.id)}
                        className="flex items-center space-x-3"
                      >
                        {attendee.present ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </button>
                      <div>
                        <p className="font-medium text-gray-900">{attendee.name} {attendee.surname}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{attendee.phone}</span>
                          <span>•</span>
                          <span>{attendee.cellGroup || 'No cell group assigned'}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {attendee.isFirstTimer && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              First Timer
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${attendee.present
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {attendee.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {attendee.isFirstTimer && (
                        <button
                          onClick={() => window.open(`tel:${attendee.phone}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                        >
                          Call
                        </button>
                      )}
                      <button
                        onClick={() => setShowQuickMenu(showQuickMenu === attendee.id ? null : attendee.id)}
                        className="text-gray-400 hover:text-gray-600 relative"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {showQuickMenu === attendee.id && (
                        <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => markAsPresent(attendee.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                              Mark as Present
                            </button>
                            <button
                              onClick={() => markAsAbsent(attendee.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                              Mark as Absent
                            </button>
                            <button
                              onClick={() => editAttendee(attendee.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showQuickMenu && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowQuickMenu(null)}
          ></div>
        )}

        {showAddParticipants && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Participants to Event</h3>
                <button
                  onClick={() => {
                    setShowAddParticipants(false);
                    setSelectedMembers([]);
                    setMemberSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search members by name, email, or cell group..."
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {selectedMembers.length > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {memberSearchTerm ? 'No members found matching your search.' : 'All members have been added.'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => toggleMemberSelection(member.id)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => {}}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.name} {member.surname}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{member.email}</span>
                                {member.phone && (
                                  <>
                                    <span>•</span>
                                    <span>{member.phone}</span>
                                  </>
                                )}
                                {member.cell_group && (
                                  <>
                                    <span>•</span>
                                    <span>{member.cell_group}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddParticipants(false);
                    setSelectedMembers([]);
                    setMemberSearchTerm('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddParticipants}
                  disabled={selectedMembers.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add {selectedMembers.length > 0 && `(${selectedMembers.length})`} Participant{selectedMembers.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddAttendee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Attendee</h3>
              <form className="space-y-4" onSubmit={addNewAttendee}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                  <input
                    type="text"
                    name="surname"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter surname"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+27123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cell Group</label>
                  <select name="cellGroup" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Cell Group</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Men Fellowship">Men Fellowship</option>
                    <option value="Women Fellowship">Women Fellowship</option>
                    <option value="Youth">Youth</option>
                    <option value="Young Adults">Young Adults</option>
                    <option value="Worship Team">Worship Team</option>
                    <option value="Cell Group A">Cell Group A</option>
                    <option value="Cell Group B">Cell Group B</option>
                    <option value="Cell Group C">Cell Group C</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="firstTimer"
                    name="firstTimer"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="firstTimer" className="ml-2 block text-sm text-gray-900">
                    First-time visitor
                  </label>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddAttendee(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Attendee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showAddEvent) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowAddEvent(false)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Event</h2>

          <form className="space-y-6" onSubmit={handleCreateEvent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="sunday_service">Sunday Service</option>
                  <option value="cell_group">Cell Group</option>
                  <option value="custom">Custom Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event location"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <button
          onClick={() => setShowAddEvent(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventDate = new Date(event.event_date).toLocaleDateString();
          const eventTime = event.event_time;

          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                  {event.type.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {eventDate} at {eventTime}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
