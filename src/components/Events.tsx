import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AttendanceList } from './AttendanceList';
import type { Event } from '../types/database';

export function Events() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockEvents = [
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


  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sunday_service':
        return 'bg-blue-100 text-blue-800';
      case 'cell_group':
        return 'bg-green-100 text-green-800';
      case 'custom':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent) || mockEvents.find(e => e.id === selectedEvent);
    if (!event) return null;

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
                  {event.event_date || event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {event.event_time || event.time}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
              {event.type.replace('_', ' ')}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Users className="w-5 h-5 mr-2" />
              Attendance Tracking
            </h3>
            <AttendanceList eventId={event.id} onClose={() => setSelectedEvent(null)} />
          </div>
        </div>
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading events...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(events.length > 0 ? events : mockEvents).map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.event_date || event.date} at {event.event_time || event.time}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                )}
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
      )}
    </div>
  );
}