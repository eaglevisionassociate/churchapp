import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AttendanceStats {
  date: string;
  total: number;
  present: number;
  firstTimers: number;
}

interface GrowthMetrics {
  totalMembers: number;
  averageAttendance: number;
  firstTimersThisMonth: number;
  growthRate: number;
  weeklyStats: AttendanceStats[];
  monthlyStats: AttendanceStats[];
}

export function GrowthDashboard() {
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadGrowthMetrics();
  }, []);

  const loadGrowthMetrics = async () => {
    setLoading(true);
    try {
      const [usersResponse, attendancesResponse, eventsResponse] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('attendances').select('*, event:events(event_date)'),
        supabase.from('events').select('*').order('event_date', { ascending: false })
      ]);

      if (usersResponse.error || attendancesResponse.error || eventsResponse.error) {
        console.error('Error loading metrics');
        return;
      }

      const users = usersResponse.data || [];
      const attendances = attendancesResponse.data || [];
      const events = eventsResponse.data || [];

      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

      const attendancesThisMonth = attendances.filter(a => {
        const eventDate = a.event?.event_date ? new Date(a.event.event_date) : null;
        return eventDate && eventDate >= oneMonthAgo;
      });

      const attendancesLastMonth = attendances.filter(a => {
        const eventDate = a.event?.event_date ? new Date(a.event.event_date) : null;
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
        return eventDate && eventDate >= twoMonthsAgo && eventDate < oneMonthAgo;
      });

      const firstTimersThisMonth = attendancesThisMonth.filter(a => a.is_first_timer).length;

      const avgAttendanceThisMonth = attendancesThisMonth.filter(a => a.present).length /
        Math.max(events.filter(e => new Date(e.event_date) >= oneMonthAgo).length, 1);

      const avgAttendanceLastMonth = attendancesLastMonth.filter(a => a.present).length /
        Math.max(events.filter(e => {
          const eventDate = new Date(e.event_date);
          const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
          return eventDate >= twoMonthsAgo && eventDate < oneMonthAgo;
        }).length, 1);

      const growthRate = avgAttendanceLastMonth > 0
        ? ((avgAttendanceThisMonth - avgAttendanceLastMonth) / avgAttendanceLastMonth) * 100
        : 0;

      const eventsByDate = new Map<string, { present: number; total: number; firstTimers: number }>();

      attendances.forEach(a => {
        if (!a.event?.event_date) return;
        const date = a.event.event_date;
        const current = eventsByDate.get(date) || { present: 0, total: 0, firstTimers: 0 };
        current.total++;
        if (a.present) current.present++;
        if (a.is_first_timer) current.firstTimers++;
        eventsByDate.set(date, current);
      });

      const weeklyStats: AttendanceStats[] = [];
      const monthlyStats: AttendanceStats[] = [];

      events.forEach(event => {
        const eventDate = new Date(event.event_date);
        const stats = eventsByDate.get(event.event_date);

        if (stats) {
          const stat: AttendanceStats = {
            date: event.event_date,
            total: stats.total,
            present: stats.present,
            firstTimers: stats.firstTimers
          };

          if (eventDate >= oneWeekAgo) {
            weeklyStats.push(stat);
          }
          if (eventDate >= oneMonthAgo) {
            monthlyStats.push(stat);
          }
        }
      });

      weeklyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      monthlyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setMetrics({
        totalMembers: users.length,
        averageAttendance: Math.round(avgAttendanceThisMonth),
        firstTimersThisMonth,
        growthRate: Math.round(growthRate * 10) / 10,
        weeklyStats,
        monthlyStats
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading growth metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  const stats = timeframe === 'week' ? metrics.weeklyStats : metrics.monthlyStats;
  const maxValue = Math.max(...stats.map(s => s.present), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Growth Analytics</h2>
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.totalMembers}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.averageAttendance}</div>
          <div className="text-sm text-gray-600">Avg Attendance</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.firstTimersThisMonth}</div>
          <div className="text-sm text-gray-600">First Timers (Month)</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${
              metrics.growthRate >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                metrics.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <div className={`text-2xl font-bold ${
              metrics.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {metrics.growthRate > 0 ? '+' : ''}{metrics.growthRate}%
            </div>
            {metrics.growthRate >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-sm text-gray-600">Growth Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Attendance Trends ({timeframe === 'week' ? 'Last 7 Days' : 'Last 30 Days'})
        </h3>

        {stats.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No attendance data available for this timeframe
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat, index) => {
              const percentage = (stat.present / maxValue) * 100;
              const date = new Date(stat.date);
              const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{formattedDate}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">
                        <span className="font-medium text-green-600">{stat.present}</span> present
                      </span>
                      {stat.firstTimers > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          {stat.firstTimers} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {stat.present} / {stat.total}
                      </span>
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {Math.round((stat.present / stat.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Average Attendance Rate</p>
                <p className="text-sm text-gray-600">
                  {stats.length > 0
                    ? Math.round((stats.reduce((sum, s) => sum + (s.present / s.total), 0) / stats.length) * 100)
                    : 0}% of members attend events
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">First Timer Conversion</p>
                <p className="text-sm text-gray-600">
                  {metrics.firstTimersThisMonth} new visitors this month
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                metrics.growthRate >= 0 ? 'bg-emerald-600' : 'bg-red-600'
              }`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Growth Trajectory</p>
                <p className="text-sm text-gray-600">
                  {metrics.growthRate >= 0 ? 'Positive' : 'Declining'} growth trend
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Events</span>
              <span className="text-sm font-medium text-gray-900">{stats.length}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Peak Attendance</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.max(...stats.map(s => s.present), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Lowest Attendance</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.length > 0 ? Math.min(...stats.map(s => s.present)) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total First Timers</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.reduce((sum, s) => sum + s.firstTimers, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
