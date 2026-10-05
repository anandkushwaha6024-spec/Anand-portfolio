import React, { useState } from 'react';
import { Menu, Search, User, LogOut, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Link } from 'react-router-dom';

export const Header = ({ onMenuClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const { search, setSearch } = useTasks();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left Section: Mobile Menu Toggle & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-500 rounded-xl hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700/80"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Quick Search Input */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/80 dark:bg-slate-700/60 border border-transparent dark:border-slate-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Section: Theme Toggle & User Menu */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/80 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-slate-200">
                {user?.name}
              </span>
            </button>

            {/* Dropdown Card */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/80 py-2 z-50 animate-fade-in"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700/80">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                  {isAdmin && (
                    <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      <ShieldCheck className="w-3 h-3 mr-1" /> ADMIN
                    </span>
                  )}
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                >
                  <User className="w-4 h-4 mr-2.5" /> Profile Settings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5" /> Admin Dashboard
                  </Link>
                )}

                <div className="my-1 border-t border-gray-100 dark:border-slate-700/80"></div>

                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4 mr-2.5" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
