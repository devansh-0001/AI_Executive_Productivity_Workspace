import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, Calendar, FileText } from 'lucide-react';
import api from '../api/client';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <span className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell size={16} className="text-sky-400" />
              Notifications & Alerts
            </span>
            <span className="text-xs text-slate-400">{unreadCount} unread</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No notifications right now</div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 text-xs cursor-pointer hover:bg-slate-800/60 transition ${
                    n.isRead ? 'opacity-60' : 'bg-slate-800/20 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-200">{n.title}</span>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
                  </div>
                  <p className="text-slate-300 leading-snug">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
