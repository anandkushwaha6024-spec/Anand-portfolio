import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Camera,
  History,
  User,
  Settings,
  UserCheck,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const { role } = useAuth();

  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      name: 'Students Management',
      path: '/students',
      icon: Users,
      roles: ['ADMIN', 'TEACHER']
    },
    {
      name: 'Live Face Scanner',
      path: '/attendance/live',
      icon: Camera,
      roles: ['ADMIN', 'TEACHER']
    },
    {
      name: 'Attendance History',
      path: '/attendance/history',
      icon: History,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: User,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    }
  ];

  const allowedLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/60 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
          Navigation Menu
        </p>
        {allowedLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
