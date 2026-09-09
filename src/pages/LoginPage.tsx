import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, switchUser, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/items';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      await login({ email: email.trim() });
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleDemoUserLogin = async (userId: string, demoEmail: string) => {
    setError('');
    try {
      await switchUser(userId);
      navigate(redirectUrl);
    } catch {
      try {
        await login({ email: demoEmail });
        navigate(redirectUrl);
      } catch (err: any) {
        setError(err.message || 'Demo login failed');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-black p-7 sm:p-9 shadow-[6px_6px_0px_#000] space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Welcome Back, Neighbor
        </h2>
        <p className="text-xs sm:text-sm font-bold text-neutral-600">
          Sign in to borrow tools, manage your equipment listings, or chat.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-black text-xs font-black text-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Sign In Persona Shortcuts */}
      <div className="p-4 rounded-2xl bg-[#fffdf0] border-2 border-black space-y-2.5 shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-black">
          <Sparkles className="w-4 h-4 text-[#ff90e8] stroke-[2.5]" />
          <span>Quick 1-Click Demo Profiles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoUserLogin('user-current', 'aiman.zikri@neighborhood.my')}
            className="jn-btn p-3 rounded-xl bg-white border-2 border-black hover:bg-[#ffc900] text-left transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <p className="text-xs font-black text-black">Aiman Zikri</p>
            <p className="text-[10px] font-bold text-emerald-800">Super Lender • 53100</p>
          </button>

          <button
            type="button"
            onClick={() => handleDemoUserLogin('user-sarah', 'sarah.lim@neighborhood.my')}
            className="jn-btn p-3 rounded-xl bg-white border-2 border-black hover:bg-[#ffc900] text-left transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <p className="text-xs font-black text-black">Sarah Lim</p>
            <p className="text-[10px] font-bold text-emerald-800">Active Borrower • 53100</p>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-black text-black uppercase mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aiman.zikri@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono font-black text-black uppercase">
              Password
            </label>
            <span className="text-[11px] font-bold text-neutral-500">Any password for demo</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="jn-btn w-full py-3.5 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 stroke-[2.5]" />
          <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs font-bold text-neutral-700">
          New to JiranAid?{' '}
          <Link to="/register" className="font-black text-black underline underline-offset-2 hover:text-[#ff90e8]">
            Join your neighborhood circle
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
