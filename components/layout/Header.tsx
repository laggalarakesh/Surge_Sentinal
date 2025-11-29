
import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { Bell, ChevronDown, Globe } from 'lucide-react';
import { NotificationCenter, Notification } from './NotificationCenter';

const getDashboardTitle = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Regional Management';
    case UserRole.HOSPITAL:
      return 'Hospital Surge Dashboard';
    case UserRole.RESEARCHER:
      return 'Research & Analytics';
    case UserRole.USER:
      return 'Public Health Portal';
    default:
      return 'Dashboard';
  }
};

const mockNotifications: Notification[] = [
    { id: 1, message: "City General Hospital has issued a 'High' severity advisory.", timestamp: '5 minutes ago', read: false },
    { id: 2, message: "New dataset 'Q3 Surge Data' is available for analysis.", timestamp: '2 hours ago', read: false },
    { id: 3, message: 'System maintenance is scheduled for 10 PM tonight.', timestamp: '1 day ago', read: true },
];

const languages = ['English', 'Hindi', 'Telugu', 'Tamil'];

export const Header: React.FC<{ user: User }> = ({ user }) => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<string>('English');
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('surgeSentinelLanguage');
        if (savedLanguage && languages.includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    const handleLanguageChange = (lang: string) => {
        setCurrentLanguage(lang);
        localStorage.setItem('surgeSentinelLanguage', lang);
        setShowLangDropdown(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="flex items-center justify-between h-20 px-8 bg-surface border-b border-gray-200/80">
            <div>
                <h2 className="text-xl font-semibold text-on-surface">{getDashboardTitle(user.role)}</h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button 
                        onClick={() => setShowLangDropdown(!showLangDropdown)} 
                        className="flex items-center gap-2 text-on-surface-muted hover:text-primary"
                    >
                        <Globe size={20} />
                        <span className="text-sm font-medium">{currentLanguage}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showLangDropdown && (
                        <div className="absolute top-10 right-0 w-36 bg-surface rounded-lg shadow-xl border border-gray-200/80 z-50">
                            <ul className="py-1">
                                {languages.map(lang => (
                                    <li key={lang}>
                                        <button 
                                            onClick={() => handleLanguageChange(lang)}
                                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-background"
                                        >
                                            {lang}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-on-surface-muted hover:text-primary">
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <NotificationCenter 
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                            onMarkAllAsRead={handleMarkAllAsRead}
                            onClose={() => setShowNotifications(false)}
                        />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* You can add an avatar here if you have one */}
                    <div>
                        <p className="font-semibold text-sm text-on-surface">{user.displayName}</p>
                        <p className="text-xs text-on-surface-muted">{user.role}</p>
                    </div>
                    <button className="text-on-surface-muted hover:text-primary">
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};