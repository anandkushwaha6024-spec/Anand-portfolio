import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  UserPlus, 
  ScanFace, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    matches: 0,
    failures: 0
  });

  useEffect(() => {
    const fetchRecentHistory = async () => {
      try {
        const res = await api.get('/identifications?limit=5');
        if (res.data.success) {
          setRecentLogs(res.data.history);
          const totalCount = res.data.total || 0;
          const matchCount = res.data.history.filter(h => h.result === 'SUCCESS').length;
          setStats({
            total: totalCount,
            matches: matchCount,
            failures: totalCount - matchCount
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchRecentHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border-cyan-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Face Recognition Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              System ready. Capture camera frames or upload images to perform biometric verification using 128-dimensional vector cosine matching.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/identify" className="btn-primary">
              <ScanFace className="w-4 h-4" />
              <span>Launch Identification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Face Enrollment Status Alert Banner */}
      <div className={`glass-panel p-4 flex items-center justify-between gap-4 ${
        user?.isFaceEnrolled 
          ? 'border-emerald-500/30 bg-emerald-950/20' 
          : 'border-amber-500/30 bg-amber-950/20'
      }`}>
        <div className="flex items-center gap-3">
          {user?.isFaceEnrolled ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm text-white">
              {user?.isFaceEnrolled ? 'Facial Biometrics Active' : 'Face Biometrics Not Enrolled'}
            </h3>
            <p className="text-xs text-slate-400">
              {user?.isFaceEnrolled
                ? 'Your face vector embedding is registered and ready for identity verification.'
                : 'Please complete face enrollment to enable facial recognition identification.'}
            </p>
          </div>
        </div>

        {!user?.isFaceEnrolled && (
          <Link to="/enroll" className="btn-primary text-xs shrink-0 whitespace-nowrap">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Face</span>
          </Link>
        )}
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/enroll" className="glass-panel p-6 glass-panel-hover flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-400 transition-colors">
              Face Enrollment
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture or upload a face image to generate and store your 128d facial biometric embedding vector.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Open Enrollment</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link to="/identify" className="glass-panel p-6 glass-panel-hover flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <ScanFace className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
              Face Identification
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan candidate faces via webcam stream to compare against database vectors and output match metrics.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Scan Camera</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link to="/history" className="glass-panel p-6 glass-panel-hover flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">
              Identification History
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse audit logs, confidence scores, timestamps, and search previous identification attempts.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>View Logs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-white">Recent Activity Stream</h2>
          </div>
          <Link to="/history" className="text-xs text-cyan-400 hover:underline font-medium">
            View All Logs →
          </Link>
        </div>

        {loadingLogs ? (
          <div className="py-8 text-center text-slate-400 text-xs">Loading activity logs...</div>
        ) : recentLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No identification activity recorded yet. Run your first face scan!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Result</th>
                  <th className="py-3 px-3">Matched User</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {log.result === 'SUCCESS' ? 'MATCH FOUND' : log.result}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {log.matchedUser?.name || 'Unrecognized Face'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {log.confidencePercentage ? `${log.confidencePercentage}%` : '0%'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
