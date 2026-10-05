import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, role } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          My Profile & Account Details
        </h2>
        <p className="text-xs text-slate-400">Authenticated user parameters & credentials</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-2xl font-extrabold text-white shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
              Role: {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-400" /> Email Address
            </p>
            <p className="text-sm font-medium text-white">{user?.email}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="font-semibold text-slate-400 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Department & Course
            </p>
            <p className="text-sm font-medium text-white">{user?.department || 'CSE'} ({user?.course || 'B.Tech'})</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-400" /> Academic Year & Section
            </p>
            <p className="text-sm font-medium text-white">{user?.year || '4th Year'} - Section {user?.section || 'A'}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="font-semibold text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Face Vector Status
            </p>
            <p className="text-sm font-medium text-emerald-400">
              {user?.isFaceRegistered ? 'Registered (128D Vector Active)' : 'Not Enrolled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
