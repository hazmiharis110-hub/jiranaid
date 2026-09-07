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
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-[#24211d]">
          Welcome Back, Neighbor
        </h2>
        <p className="text-xs sm:text-sm text-[#67635c]">
          Sign in to borrow tools, manage your equipment listings, or chat.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Sign In Persona Shortcuts */}
      <div className="p-4 rounded-2xl bg-[#f4efe6] border border-[#ded7c8] space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4e4a43]">
          <Sparkles className="w-3.5 h-3.5 text-[#c86d51]" />
          <span>Quick 1-Click Demo Profiles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoUserLogin('user-current', 'aiman.zikri@neighborhood.my')}
            className="px-3 py-2 rounded-xl bg-white border border-[#ded7c8] hover:border-[#c86d51] text-left transition-all"
          >
            <p className="text-xs font-bold text-[#24211d]">Aiman Zikri</p>
            <p className="text-[10px] text-[#5f7d66]">Super Lender • 53100</p>
          </button>

          <button
            type="button"
            onClick={() => handleDemoUserLogin('user-sarah', 'sarah.lim@neighborhood.my')}
            className="px-3 py-2 rounded-xl bg-white border border-[#ded7c8] hover:border-[#c86d51] text-left transition-all"
          >
            <p className="text-xs font-bold text-[#24211d]">Sarah Lim</p>
            <p className="text-[10px] text-[#5f7d66]">Active Borrower • 53100</p>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aiman.zikri@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#4e4a43]">
              Password
            </label>
            <span className="text-[11px] text-[#8a857b]">Any password for demo</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#24211d] hover:bg-black text-[#faf8f5] text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-[#67635c]">
          New to JiranAid?{' '}
          <Link to="/register" className="font-bold text-[#c86d51] hover:underline">
            Join your neighborhood circle
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
