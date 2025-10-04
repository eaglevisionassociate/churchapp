import { useState } from 'react';
import { Users, Shield, UserCheck, Wrench, Music, Baby, CheckCircle, AlertTriangle, Phone } from 'lucide-react';

export function Departments() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Mock departments data
  const departments = [
    {
      id: '1',
      name: 'Security',
      icon: Shield,
      color: 'bg-red-500',
      members: 8,
      activeMembers: 6,
      description: 'Church security and safety team',
      teams: [
        { name: 'Main Security', members: 5, leader: 'Sipho Ndlovu' },
        { name: 'Parking', members: 3, leader: 'Themba Zulu' },
      ],
    },
    {
      id: '2',
      name: 'Ushers',
      icon: UserCheck,
      color: 'bg-green-500',
      members: 12,
      activeMembers: 10,
      description: 'Welcome and seating coordination',
      teams: [
        { name: 'Main Entrance', members: 6, leader: 'Zanele Khumalo' },
        { name: 'Side Entrance', members: 4, leader: 'Nomthandazo Ngcobo' },
        { name: 'Special Events', members: 2, leader: 'Sibongile Radebe' },
      ],
    },
    {
      id: '3',
      name: 'Technicians',
      icon: Wrench,
      color: 'bg-blue-500',
      members: 15,
      activeMembers: 12,
      description: 'Audio, visual, and technical equipment',
      teams: [
        { name: 'Sound Team', members: 5, leader: 'Nkosana Mbeki' },
        { name: 'Camera Team', members: 4, leader: 'Lerato Molefe' },
        { name: 'Lighting Team', members: 3, leader: 'Mpho Tshwane' },
        { name: 'IT Support', members: 3, leader: 'Mandla Mokoena' },
      ],
      equipment: [
        { name: 'Main Mixing Console', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Wireless Microphones', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Main Speakers', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Monitor Speakers', status: 'needs_repair', lastChecked: '2 hours ago', issue: 'Left monitor has crackling sound' },
        { name: 'Main Camera', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Streaming Equipment', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Stage Lights', status: 'working', lastChecked: '2 hours ago' },
        { name: 'Ambient Lighting', status: 'needs_repair', lastChecked: '2 hours ago', issue: 'Two bulbs need replacement' },
      ],
    },
    {
      id: '4',
      name: 'Worship',
      icon: Music,
      color: 'bg-purple-500',
      members: 18,
      activeMembers: 15,
      description: 'Music and worship leading',
      teams: [
        { name: 'Instruments', members: 8, leader: 'Kagiso Lekota' },
        { name: 'Vocals', members: 10, leader: 'Precious Mahlangu' },
      ],
    },
    {
      id: '5',
      name: 'Children Ministry',
      icon: Baby,
      color: 'bg-yellow-500',
      members: 10,
      activeMembers: 8,
      description: 'Sunday school and kids programs',
      teams: [
        { name: 'Toddlers', members: 4, leader: 'Grace Mthembu' },
        { name: 'Primary', members: 6, leader: 'Sarah Dube' },
      ],
    },
  ];

  if (selectedDepartment) {
    const dept = departments.find(d => d.id === selectedDepartment);
    if (!dept) return null;

    const Icon = dept.icon;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedDepartment(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Departments
        </button>

        {/* Department Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`${dept.color} p-3 rounded-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{dept.name}</h2>
              <p className="text-gray-600">{dept.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{dept.members}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{dept.activeMembers}</p>
              <p className="text-sm text-gray-600">Active This Week</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{dept.teams.length}</p>
              <p className="text-sm text-gray-600">Teams</p>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Teams</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.teams.map((team, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    <span className="text-sm text-gray-600">{team.members} members</span>
                  </div>
                  <p className="text-sm text-gray-600">Led by {team.leader}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Status (only for Technicians) */}
        {dept.name === 'Technicians' && dept.equipment && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dept.equipment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.status === 'working' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Last checked: {item.lastChecked}</p>
                        {item.issue && (
                          <p className="text-sm text-red-600 mt-1">{item.issue}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'working' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'working' ? 'Working' : 'Needs Repair'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Equipment check completed</p>
                  <p className="text-sm text-gray-600">Sunday Morning Service - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Team attendance marked</p>
                  <p className="text-sm text-gray-600">{dept.activeMembers} out of {dept.members} members present</p>
                </div>
              </div>
              {dept.name === 'Technicians' && (
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Equipment issue reported</p>
                    <p className="text-sm text-gray-600">Monitor speaker needs repair - 2 hours ago</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`${dept.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dept.members}</p>
                  <p className="text-sm text-gray-600">Total Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{dept.activeMembers}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{dept.teams.length} teams</span>
                <span className="text-sm text-blue-600 font-medium">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* First-Timer Follow-ups */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            First-Timer Follow-ups
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { name: 'Amahle Zungu', phone: '+27123456809', status: 'connected', lastCall: '1 day ago', notes: 'Enjoyed the service, wants to join Cell Group A' },
              { name: 'Lwazi Maseko', phone: '+27123456810', status: 'no_answer', lastCall: '2 days ago', notes: 'Left voicemail, will try again' },
              { name: 'Nosipho Gumede', phone: '+27123456811', status: 'follow_up_needed', lastCall: '3 days ago', notes: 'Interested in baptism classes' },
            ].map((person, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.status === 'connected' ? 'bg-green-100 text-green-800' :
                      person.status === 'no_answer' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {person.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{person.phone} • Last call: {person.lastCall}</p>
                  <p className="text-sm text-gray-500 mt-1">{person.notes}</p>
                </div>
                <button 
                  onClick={() => window.open(`tel:${person.phone}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}