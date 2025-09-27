import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle, Search, UserPlus } from 'lucide-react';

export function Events() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAttendee, setShowAddAttendee] = useState(false);

  // Mock events data
  const events = [
    {
      id: '1',
      title: 'Sunday Morning Service',
      type: 'sunday_service',
      date: '2024-01-07',
      time: '09:00',
      location: 'Main Sanctuary',
      description: 'Weekly Sunday morning worship service',
      attendees: 156,
      status: 'completed',
    },
    {
      id: '2',
      title: 'Sunday Evening Service',
      type: 'sunday_service',
      date: '2024-01-07',
      time: '18:00',
      location: 'Main Sanctuary',
      description: 'Sunday evening service',
      attendees: 89,
      status: 'completed',
    },
    {
      id: '3',
      title: 'Cell Group A Meeting',
      type: 'cell_group',
      date: '2024-01-10',
      time: '19:00',
      location: 'Room 101',
      description: 'Weekly cell group meeting',
      attendees: 12,
      status: 'upcoming',
    },
    {
      id: '4',
      title: 'Youth Service',
      type: 'custom',
      date: '2024-01-12',
      time: '18:30',
      location: 'Youth Hall',
      description: 'Monthly youth gathering',
      attendees: 45,
      status: 'upcoming',
    },
  ];

  // Mock attendees data for the selected event
  const mockAttendees = [
    { id: '1', name: 'Thabo', surname: 'Mthembu', phone: '+27123456789', cellGroup: 'Leadership', isFirstTimer: false, present: true },
    { id: '2', name: 'Nomsa', surname: 'Dlamini', phone: '+27123456790', cellGroup: 'Leadership', isFirstTimer: false, present: true },
    { id: '3', name: 'Sipho', surname: 'Ndlovu', phone: '+27123456791', cellGroup: 'Men Fellowship', isFirstTimer: false, present: true },
    { id: '4', name: 'Amahle', surname: 'Zungu', phone: '+27123456809', cellGroup: null, isFirstTimer: true, present: true },
    { id: '5', name: 'Zanele', surname: 'Khumalo', phone: '+27123456792', cellGroup: 'Women Fellowship', isFirstTimer: false, present: true },
    { id: '6', name: 'Mandla', surname: 'Mokoena', phone: '+27123456793', cellGroup: 'Youth', isFirstTimer: false, present: true },
    { id: '7', name: 'Precious', surname: 'Mahlangu', phone: '+27123456794', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
    { id: '8', name: 'Bongani', surname: 'Sithole', phone: '+27123456795', cellGroup: 'Events Team', isFirstTimer: false, present: true },
    { id: '9', name: 'Themba', surname: 'Zulu', phone: '+27123456796', cellGroup: 'Men Fellowship', isFirstTimer: false, present: true },
    { id: '10', name: 'Nomthandazo', surname: 'Ngcobo', phone: '+27123456798', cellGroup: 'Women Fellowship', isFirstTimer: false, present: true },
    { id: '11', name: 'Sibongile', surname: 'Radebe', phone: '+27123456799', cellGroup: 'Women Fellowship', isFirstTimer: false, present: true },
    { id: '12', name: 'Thandiwe', surname: 'Cele', phone: '+27123456800', cellGroup: 'Young Adults', isFirstTimer: false, present: true },
    { id: '13', name: 'Nkosana', surname: 'Mbeki', phone: '+27123456801', cellGroup: 'Youth', isFirstTimer: false, present: true },
    { id: '14', name: 'Lerato', surname: 'Molefe', phone: '+27123456802', cellGroup: 'Young Adults', isFirstTimer: false, present: true },
    { id: '15', name: 'Naledi', surname: 'Mokwena', phone: '+27123456804', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
    { id: '16', name: 'Busisiwe', surname: 'Nkomo', phone: '+27123456806', cellGroup: 'Cell Group A', isFirstTimer: false, present: true },
    { id: '17', name: 'Sizani', surname: 'Mthethwa', phone: '+27123456807', cellGroup: 'Cell Group B', isFirstTimer: false, present: true },
    { id: '18', name: 'Lwazi', surname: 'Maseko', phone: '+27123456810', cellGroup: null, isFirstTimer: true, present: true },
    { id: '19', name: 'Nosipho', surname: 'Gumede', phone: '+27123456811', cellGroup: null, isFirstTimer: true, present: true },
    { id: '20', name: 'Kagiso', surname: 'Lekota', phone: '+27123456805', cellGroup: 'Worship Team', isFirstTimer: false, present: true },
  ];

  // Filter attendees based on search term
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
        return 'bg-purple-100 text-purple-800';
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

  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </button>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                {event.type.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Attendance Section */}
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Mark
                </button>
              </div>
            </div>

            {/* Search Bar */}
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

            {/* Attendance List */}
            <div className="space-y-3">
              {filteredAttendees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No attendees found matching your search.' : 'No attendees marked yet.'}
                </div>
              ) : (
                filteredAttendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
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
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Present
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
                        📞 Call
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Attendee Modal */}
        {showAddAttendee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Attendee</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter surname"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+27123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cell Group</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
        {/* Back Button */}
        <button
          onClick={() => setShowAddEvent(false)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </button>

        {/* Add Event Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Event</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event location"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
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
      {/* Header */}
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event.id)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {event.date} at {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {event.attendees} attendees
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                {event.type.replace('_', ' ')}
              </span>
              <span className="text-sm text-blue-600 font-medium">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}