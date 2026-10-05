import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Camera, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20">
            <Camera className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            Sign In to FaceID
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Face Identification & Attendance Management System
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. teacher@college.edu"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="border-t border-slate-800 pt-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">Quick Demo Accounts:</p>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => handleDemoLogin('admin@college.edu', 'admin123')}
              className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-1.5 font-medium text-purple-300 hover:bg-purple-500/20"
            >
              Admin Demo
            </button>
            <button
              onClick={() => handleDemoLogin('teacher@college.edu', 'teacher123')}
              className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-1.5 font-medium text-blue-300 hover:bg-blue-500/20"
            >
              Teacher Demo
            </button>
            <button
              onClick={() => handleDemoLogin('student@college.edu', 'student123')}
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5 font-medium text-emerald-300 hover:bg-emerald-500/20"
            >
              Student Demo
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Register Student Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
