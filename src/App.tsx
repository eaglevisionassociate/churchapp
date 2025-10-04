import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Events } from './components/Events';
import { Departments } from './components/Departments';
import { Members } from './components/Members';
import { Admin } from './components/Admin';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Mock user role - in real app this would come from authentication
  const userRole = 'admin';

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <Events />;
      case 'departments':
        return <Departments />;
      case 'members':
        return <Members />;
      case 'admin':
        return userRole === 'admin' ? <Admin /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      currentTab={currentTab} 
      onTabChange={setCurrentTab}
      userRole={userRole}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;