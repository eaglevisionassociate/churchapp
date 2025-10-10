// Admin.tsx
import { useState } from 'react';
import { Key, Shield, Settings, Upload, Save, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'department_leader' | 'event_leader' | 'member' | 'view_only';
  pin: string;
  department: string | null;
}

export function Admin() {
  const [activeTab, setActiveTab] = useState('permissions');
  const [churchInfo, setChurchInfo] = useState<{
    name: string;
    email: string;
    logo: File | null;
  }>({
    name: 'CFC Pretoria East',
    email: 'info@cfcpretoriaeast.org',
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // Mock users data - consistent with Members component
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Thabo Mthembu', email: 'admin1@cfcpretoriaeast.org', role: 'admin', pin: '1001', department: null },
    { id: '2', name: 'Nomsa Dlamini', email: 'admin2@cfcpretoriaeast.org', role: 'admin', pin: '1002', department: null },
    { id: '3', name: 'Sipho Ndlovu', email: 'security.lead@cfcpretoriaeast.org', role: 'department_leader', pin: '2001', department: 'Security' },
    { id: '4', name: 'Zanele Khumalo', email: 'ushers.lead@cfcpretoriaeast.org', role: 'department_leader', pin: '2002', department: 'Ushers' },
    { id: '5', name: 'Mandla Mokoena', email: 'tech.lead@cfcpretoriaeast.org', role: 'department_leader', pin: '2003', department: 'Technicians' },
  ]);

  const permissions = {
    admin: ['View All Data', 'Edit All Data', 'Delete Records', 'Manage Users', 'System Settings', 'Generate Reports', 'Manage PINs', 'Department Access'],
    department_leader: ['View Department Data', 'Edit Attendance', 'Manage Checklists', 'View Reports', 'Call First-Timers'],
    event_leader: ['Create Events', 'Mark Attendance', 'View Event Data', 'Generate Event Reports'],
    member: ['View Own Data', 'Update Profile'],
    view_only: ['View Public Data', 'View Events', 'View Dashboard']
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'department_leader':
        return 'bg-blue-100 text-blue-800';
      case 'event_leader':
        return 'bg-green-100 text-green-800';
      case 'member':
        return 'bg-gray-100 text-gray-800';
      case 'view_only':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generatePIN = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleRegeneratePIN = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, pin: generatePIN() } : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        setChurchInfo(prev => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChurchInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setChurchInfo({
      name: formData.get('churchName') as string,
      email: formData.get('contactEmail') as string,
      logo: churchInfo.logo
    });
    alert('Church information updated successfully!');
  };

  const tabs = [
    { id: 'permissions', label: 'Role Permissions', icon: Shield },
    { id: 'pins', label: 'PIN Management', icon: Key },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'members', label: 'Member Roles', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Member Roles Tab - NEW */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Manage Member Roles & Permissions</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Select Member</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMember?.id === user.id
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMember(user)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.department && (
                              <p className="text-sm text-gray-500">{user.department}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Assignment */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Assign Role & Permissions</h4>
                  {selectedMember ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Current Role: {selectedMember.role.replace('_', ' ')}</h5>
                        <select
                          value={selectedMember.role}
                          onChange={(e) => handleRoleChange(selectedMember.id, e.target.value as User['role'])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="department_leader">Department Leader</option>
                          <option value="event_leader">Event Leader</option>
                          <option value="member">Member</option>
                          <option value="view_only">View Only</option>
                        </select>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Permissions</h5>
                        <div className="space-y-2">
                          {permissions[selectedMember.role]?.map((permission, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">PIN: {selectedMember.pin}</span>
                          <button
                            onClick={() => handleRegeneratePIN(selectedMember.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Regenerate PIN
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a member to assign roles and permissions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PIN Management Tab */}
          {activeTab === 'pins' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">PIN Management</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Key className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      PIN Security Guidelines
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>PINs should be 4-6 digits long</li>
                        <li>Avoid sequential numbers (1234, 5678)</li>
                        <li>Each user must have a unique PIN</li>
                        <li>PINs can be regenerated if compromised</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
                        {user.department && (
                          <p className="text-sm text-gray-500">{user.department}</p>
                        )}
                      </div>
                      <span className="text-lg font-mono font-bold text-blue-600">{user.pin}</span>
                    </div>
                    <button
                      onClick={() => handleRegeneratePIN(user.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Regenerate PIN
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Role-Based Permissions</h3>
              
              <div className="space-y-4">
                {Object.entries(permissions).map(([role, rolePermissions]) => (
                  <div key={role} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 capitalize">{role.replace('_', ' ')}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
                        {users.filter(user => user.role === role).length} users
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {rolePermissions.map((permission) => (
                        <div key={permission} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              
              <div className="space-y-6">
                <form onSubmit={handleSaveChurchInfo}>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Church Information</h4>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
                        <input
                          type="text"
                          name="churchName"
                          value={churchInfo.name}
                          onChange={(e) => setChurchInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={churchInfo.email}
                          onChange={(e) => setChurchInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Church Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Church logo" className="w-16 h-16 rounded-lg object-cover" />
                            ) : (
                              <span className="text-gray-400">Logo</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              id="logoUpload"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="logoUpload"
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Logo
                            </label>
                            <p className="text-sm text-gray-500 mt-1">Recommended: 256x256px PNG or JPG</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-600">Download all church data as Excel file</p>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Export to Excel
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Import Data</p>
                        <p className="text-sm text-gray-600">Import member data from Excel file</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Import from Excel
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Backup Database</p>
                        <p className="text-sm text-gray-600">Create a backup of all data</p>
                      </div>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Create Backup
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">System Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">45</p>
                      <p className="text-sm text-gray-600">Events This Month</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">1,234</p>
                      <p className="text-sm text-gray-600">Total Attendances</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">23</p>
                      <p className="text-sm text-gray-600">First-Timers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}