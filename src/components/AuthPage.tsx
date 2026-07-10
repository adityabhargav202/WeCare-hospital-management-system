import React, { useState } from 'react';
import { Activity, Mail, Lock, Phone, User, LogIn, UserPlus, ShieldAlert, ArrowRight } from 'lucide-react';
import { authService } from '../lib/api';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  initialMode?: 'login' | 'signup' | 'admin';
}

export default function AuthPage({ onAuthSuccess, initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'admin'>(initialMode);
  
  // Input fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Admin credentials (often uses email and password)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Status/Errors
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      if (data.success) {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your network and credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.signup({
        fullName,
        email,
        phone,
        password,
      });

      if (data.success) {
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.adminLogin({
        email: adminEmail,
        password: adminPassword,
      });

      if (data.success) {
        setSuccessMsg('Admin logged in successfully!');
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.message || 'Invalid Admin credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="py-16 bg-slate-50/50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden p-8 sm:p-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Administrative Center'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'login' 
                ? 'Sign in to schedule visits and track appointment history.' 
                : mode === 'signup' 
                  ? 'Join WeCare to access medical specialists and health bookings.' 
                  : 'Authorized personnel access only.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/20">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Patient Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('admin'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              mode === 'admin' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-medium animate-pulse">
            {successMsg}
          </div>
        )}

        {/* FORMS */}
        {mode === 'login' && (
          <form onSubmit={handlePatientLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Verifying Account...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handlePatientSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="eleanor@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>
        )}

        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Admin Identity Key (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="adityabhargav915@gmail.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Administrative Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-amber-400 font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>{loading ? 'Authenticating Admin...' : 'Secure Administrator Sign In'}</span>
            </button>
          </form>
        )}

        {/* Footer info helper */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-400">
            Secure, encrypted medical authorization. WeCare conforms to modern medical data policies.
          </p>
        </div>

      </div>
    </div>
  );
}
