import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Star,
  Package,
  Wrench,
  Award,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser, currentNeighborhood, switchUser } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center space-y-4">
        <User className="w-12 h-12 text-[#c86d51] mx-auto" />
        <h2 className="text-xl font-bold text-[#24211d]">Sign in to View Profile</h2>
        <p className="text-xs text-[#67635c]">
          View your neighbor trust badges, lending track record, and verified community status.
        </p>
        <button
          onClick={() => {
            if (outletContext?.onOpenAuth) outletContext.onOpenAuth('login');
            else navigate('/login');
          }}
          className="px-5 py-2.5 rounded-xl bg-[#24211d] text-white text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/items"
          className="jn-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ffc900] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border-3 border-black p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-black shadow-[3px_3px_0px_#000]"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                {currentUser.name}
              </h1>
              <span className="jn-badge inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#bbf7d0] text-black border-2 border-black text-xs font-mono font-black shadow-[1.5px_1.5px_0px_#000] w-fit mx-auto sm:mx-0">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Verified Resident</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-neutral-700 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-black stroke-[2.5]" />
              <span>
                {currentUser.neighborhoodName} • Postcode {currentUser.postcode}
              </span>
            </p>

            <p className="text-xs font-bold text-neutral-500">
              Member since {currentUser.joinedDate || 'September 2025'}
            </p>
          </div>

          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#ffc900] border-2 border-black text-black shadow-[3px_3px_0px_#000]">
              <Star className="w-5 h-5 text-black fill-amber-400 stroke-[2.5]" />
              <span className="text-xl font-black font-mono">{(currentUser.trustScore ?? 5.0).toFixed(1)}</span>
              <span className="text-xs font-mono font-black uppercase">Trust</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-black text-center">
          <div className="p-4 bg-[#faf9f6] rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <p className="text-2xl sm:text-3xl font-black font-mono text-black">
              {currentUser.totalLends ?? 0}
            </p>
            <p className="text-xs font-mono font-black uppercase text-neutral-600 mt-1">
              Tools Shared
            </p>
          </div>

          <div className="p-4 bg-[#faf9f6] rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <p className="text-2xl sm:text-3xl font-black font-mono text-black">
              {currentUser.totalBorrows ?? 0}
            </p>
            <p className="text-xs font-mono font-black uppercase text-neutral-600 mt-1">
              Items Borrowed
            </p>
          </div>

          <div className="p-4 bg-[#faf9f6] rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              {currentUser.onTimeReturnRate ?? 100}%
            </p>
            <p className="text-xs font-mono font-black uppercase text-neutral-600 mt-1">
              On-Time Rate
            </p>
          </div>
        </div>

        {/* Community Badges */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Award className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Community Badges Earned</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {currentUser.badges?.map((badge) => (
              <span
                key={badge}
                className="px-3.5 py-2 rounded-xl bg-[#faf9f6] border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
