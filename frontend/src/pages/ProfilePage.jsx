import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Shield, Trash2, CheckCircle2, AlertTriangle, Save, RefreshCw, Key } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingFace, setIsDeletingFace] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.put(`/users/${user._id}`, { name, email });
      if (res.data.success) {
        updateUserProfile({ name, email });
        showToast('Profile details updated successfully.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteFaceBiometrics = async () => {
    if (!window.confirm('Are you sure you want to delete your enrolled facial biometric vector from the database? This action cannot be undone.')) {
      return;
    }

    setIsDeletingFace(true);
    try {
      const res = await api.delete(`/face/${user._id}`);
      if (res.data.success) {
        updateUserProfile({ isFaceEnrolled: false });
        showToast('Facial biometric vector deleted successfully.', 'info');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete facial vector.', 'error');
    } finally {
      setIsDeletingFace(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="glass-panel p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Role: {user?.role}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              user?.isFaceEnrolled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {user?.isFaceEnrolled ? 'Face Enrolled' : 'Face Not Enrolled'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Profile Form */}
        <div className="glass-panel p-6">
          <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Account Details</span>
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full"
              />
            </div>

            <button type="submit" disabled={isUpdating} className="btn-primary w-full text-xs py-2.5">
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Biometric Privacy & Controls */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Biometric Security Management</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your biometric face embedding is stored as a 128d math vector array. You can revoke and delete this biometric data at any time.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Enrollment Status:</span>
                <span className={`font-semibold ${user?.isFaceEnrolled ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {user?.isFaceEnrolled ? 'Active Embedding in Database' : 'No Vector Stored'}
                </span>
              </div>
            </div>
          </div>

          {user?.isFaceEnrolled && (
            <div className="pt-6 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={handleDeleteFaceBiometrics}
                disabled={isDeletingFace}
                className="btn-danger w-full text-xs py-2.5"
              >
                {isDeletingFace ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting Vector...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Enrolled Facial Vector</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
