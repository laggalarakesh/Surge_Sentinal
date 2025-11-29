
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Hospital, Microscope, Users, LayoutDashboard, LogOut, Briefcase, Megaphone, HelpCircle, X, Bot } from 'lucide-react';

interface SidebarProps {
  userRole: UserRole;
  onLogout: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = {
  [UserRole.ADMIN]: [
    { name: 'Regional Dashboard', icon: LayoutDashboard },
    { name: 'Manage Hospitals', icon: Hospital },
    { name: 'Alerts', icon: Megaphone },
    { name: 'AI Assistant', icon: Bot },
  ],
  [UserRole.HOSPITAL]: [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Advisories', icon: Megaphone },
    { name: 'Reports', icon: Briefcase },
    { name: 'AI Assistant', icon: Bot },
  ],
  [UserRole.RESEARCHER]: [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'AI Analytics', icon: Microscope },
    { name: 'Datasets', icon: Briefcase },
    { name: 'AI Assistant', icon: Bot },
  ],
  [UserRole.USER]: [
    { name: 'Live Advisories', icon: Megaphone },
    { name: 'AI Chatbot', icon: Bot },
    { name: 'Health Tips', icon: Hospital },
  ],
};

const roleHelpText: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Tip: Monitor your region's hospitals from the dashboard. Use 'Alerts' to broadcast important messages to all managed facilities.",
    [UserRole.HOSPITAL]: "Tip: Enter daily patient counts in 'Patient Intake' and click 'Generate AI Advisory' to get instant surge analysis and staffing suggestions.",
    [UserRole.RESEARCHER]: "Tip: Use the 'AI Analytics' card to query the Gemini AI with natural language questions about the anonymized data.",
    [UserRole.USER]: "Tip: Use the 'AI Chatbot' for safe, non-diagnostic guidance powered by Gemini. Check 'Live Advisories' for real-time updates in your area.",
};


export const Sidebar: React.FC<SidebarProps> = ({ userRole, onLogout, activePage, onNavigate }) => {
  const links = navItems[userRole] || [];
  const [showHelp, setShowHelp] = useState(false);

  return (
    <aside className="w-64 bg-surface flex flex-col border-r border-gray-200/80">
      <div className="flex items-center justify-center h-20 border-b border-gray-200/80">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          SurgeSentinel
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-muted hover:bg-background hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : ''}`} />
              {item.name}
            </button>
          );
        })}
      </nav>
      
      {/* Role-specific help section */}
      <div className="px-4 py-4 border-t border-gray-200/80">
        <div className="relative">
            <div className="flex items-center justify-between text-sm text-on-surface-muted">
                <span>Current Role: <strong>{userRole}</strong></span>
                <button 
                    onClick={() => setShowHelp(!showHelp)} 
                    className="p-1 rounded-full hover:bg-gray-200"
                    aria-label="Show help"
                >
                    <HelpCircle size={18} />
                </button>
            </div>
            {showHelp && (
                 <div className="absolute bottom-10 left-0 w-[240px] bg-gray-800 text-white p-3 rounded-lg shadow-lg z-20">
                     <button onClick={() => setShowHelp(false)} className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white">
                        <X size={14} />
                     </button>
                     <p className="text-xs font-medium">{roleHelpText[userRole]}</p>
                     <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rotate-45"></div>
                </div>
            )}
        </div>
      </div>
      
      <div className="px-4 py-4 border-t border-gray-200/80">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-on-surface-muted rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};
