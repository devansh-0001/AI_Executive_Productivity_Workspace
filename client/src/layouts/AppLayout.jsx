import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Sparkles,
  Users,
  Database,
  Activity,
  Settings,
  Search,
  Zap
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import GlobalSearch from '../components/GlobalSearch';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/commitments', label: 'Commitments', icon: CheckSquare },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
  { path: '/people', label: 'People', icon: Users },
  { path: '/sources', label: 'Sources', icon: Database },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={setSearchOpen} />

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Zap size={20} className="fill-current" />
              </div>
              <div>
                <h1 className="font-semibold text-base tracking-tight text-slate-100">LeadDesk</h1>
                <p className="text-[10px] text-slate-400 font-medium">Leadership AI OS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-sky-500/20 text-sky-400">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Arjun Malhotra</div>
              <div className="text-[10px] text-slate-400 truncate">VP Sales</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs w-64 transition"
            >
              <Search size={14} />
              <span>Search intelligence (Cmd+K)...</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400 hidden sm:block">
              Context Date: <span className="text-slate-200 font-semibold">Wed, 23 Sep 2026</span>
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
