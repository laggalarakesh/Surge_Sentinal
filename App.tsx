
import React, { useState, useEffect } from 'react';
import type { User } from './types';
import { UserRole } from './types';
import { Login } from './components/auth/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { HospitalDashboard } from './components/dashboard/HospitalDashboard';
import { ResearcherDashboard } from './components/dashboard/ResearcherDashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';

const mockUsers: Record<UserRole, User> = {
  [UserRole.ADMIN]: { email: 'admin@medflux.ai', role: UserRole.ADMIN, displayName: 'Regional Admin' },
  [UserRole.HOSPITAL]: { email: 'hospital@medflux.ai', role: UserRole.HOSPITAL, displayName: 'City General' },
  [UserRole.RESEARCHER]: { email: 'research@medflux.ai', role: UserRole.RESEARCHER, displayName: 'Dr. Anya Sharma' },
  [UserRole.USER]: { email: 'public@medflux.ai', role: UserRole.USER, displayName: 'Guest User' },
};

const Dashboard: React.FC<{ user: User, activePage: string }> = ({ user, activePage }) => {
  switch (user.role) {
    case UserRole.ADMIN:
      return <AdminDashboard activePage={activePage} user={user} />;
    case UserRole.HOSPITAL:
      return <HospitalDashboard activePage={activePage} user={user} />;
    case UserRole.RESEARCHER:
      return <ResearcherDashboard activePage={activePage} user={user} />;
    case UserRole.USER:
      return <UserDashboard activePage={activePage} />;
    default:
      return <div>Dashboard not found</div>;
  }
};

const getDefaultPage = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN: return 'Regional Dashboard';
    case UserRole.HOSPITAL: return 'Dashboard';
    case UserRole.RESEARCHER: return 'Dashboard';
    case UserRole.USER: return 'Live Advisories';
    default: return 'Dashboard';
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('');

  useEffect(() => {
    const savedRole = localStorage.getItem('surgeSentinelRole');
    if (savedRole && Object.values(UserRole).includes(savedRole as UserRole)) {
      const user = mockUsers[savedRole as UserRole];
      setCurrentUser(user);
      setActivePage(getDefaultPage(user.role));
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    setCurrentUser(mockUsers[role]);
    setActivePage(getDefaultPage(role));
    localStorage.setItem('surgeSentinelRole', role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('');
    localStorage.removeItem('surgeSentinelRole');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background no-print">
      <Sidebar 
        userRole={currentUser.role} 
        onLogout={handleLogout} 
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="flex flex-col flex-1">
        <Header user={currentUser} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Dashboard user={currentUser} activePage={activePage} />
        </main>
      </div>
    </div>
  );
};

export default App;
