
import React from 'react';
import { Check, CheckCheck, BellRing } from 'lucide-react';

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  // FIX: Made onClose prop optional to match component implementation and allow for flexible usage.
  onClose?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-16 right-0 w-80 max-w-sm bg-surface rounded-lg shadow-xl border border-gray-200/80 z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-on-surface">Notifications</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
            <CheckCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-on-surface-muted py-10 px-4">
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className={`p-4 border-b border-gray-200/80 flex items-start gap-3 transition-opacity duration-300 ${notification.read ? 'opacity-60' : ''}`}>
              <div className="pt-1">
                <BellRing size={18} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-on-surface">{notification.message}</p>
                <p className="text-xs text-on-surface-muted mt-1">{notification.timestamp}</p>
              </div>
              {!notification.read && (
                <button onClick={() => onMarkAsRead(notification.id)} title="Mark as read" className="p-1 text-on-surface-muted hover:text-primary rounded-full hover:bg-gray-100">
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
