import React from 'react';
import { Users, Calendar, CheckCircle, AlertTriangle, Phone, TrendingUp } from 'lucide-react';
import { GrowthDashboard } from './GrowthDashboard';

export function Dashboard() {
  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Members',
      value: '234',
      change: '+12 this month',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'This Week\'s Events',
      value: '5',
      change: '2 upcoming',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Equipment Status',
      value: '92%',
      change: '2 items need attention',
      icon: CheckCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'First-Timer Follow-ups',
      value: '8',
      change: '3 pending calls',
      icon: Phone,
      color: 'bg-purple-500',
    },
  ];

  const recentActivity = [
    {
      type: 'attendance',
      message: 'Sunday Morning Service - 156 attendees',
      time: '2 hours ago',
      icon: Users,
    },
    {
      type: 'equipment',
      message: 'Sound equipment check completed',
      time: '4 hours ago',
      icon: CheckCircle,
    },
    {
      type: 'alert',
      message: 'Monitor speaker needs repair',
      time: '6 hours ago',
      icon: AlertTriangle,
    },
    {
      type: 'call',
      message: 'Follow-up call made to Amahle Zungu',
      time: '1 day ago',
      icon: Phone,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Cell Group A Meeting',
      date: 'Today, 7:00 PM',
      location: 'Room 101',
      attendees: 12,
    },
    {
      title: 'Youth Service',
      date: 'Tomorrow, 6:30 PM',
      location: 'Youth Hall',
      attendees: 45,
    },
    {
      title: 'Prayer Meeting',
      date: 'Friday, 6:00 AM',
      location: 'Prayer Room',
      attendees: 8,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to CFC Pretoria East</h2>
        <p className="text-blue-100">
          Manage your church activities, track attendance, and monitor equipment all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <GrowthDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'alert' ? 'bg-red-100' :
                      activity.type === 'equipment' ? 'bg-green-100' :
                      activity.type === 'call' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        activity.type === 'alert' ? 'text-red-600' :
                        activity.type === 'equipment' ? 'text-green-600' :
                        activity.type === 'call' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Events
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.attendees}</p>
                    <p className="text-xs text-gray-500">expected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}