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
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67635c] hover:text-[#24211d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-[#fcfbf9] rounded-3xl border border-[#ded7c8] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#24211d]">
                {currentUser.name}
              </h1>
              <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350] text-xs font-bold w-fit mx-auto sm:mx-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Resident</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#67635c] flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#5f7d66]" />
              <span>
                {currentUser.neighborhoodName} • Postcode {currentUser.postcode}
              </span>
            </p>

            <p className="text-xs text-[#8a857b]">
              Member since {currentUser.joinedDate || 'September 2025'}
            </p>
          </div>

          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-lg font-black">{currentUser.trustScore.toFixed(1)}</span>
              <span className="text-xs font-semibold text-amber-700">Trust Score</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#ede7db] text-center">
          <div className="p-3 bg-white rounded-2xl border border-[#ded7c8]">
            <p className="text-xl sm:text-2xl font-black text-[#24211d]">
              {currentUser.totalLends}
            </p>
            <p className="text-[11px] text-[#67635c] font-medium mt-0.5">
              Tools Shared
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#ded7c8]">
            <p className="text-xl sm:text-2xl font-black text-[#24211d]">
              {currentUser.totalBorrows}
            </p>
            <p className="text-[11px] text-[#67635c] font-medium mt-0.5">
              Items Borrowed
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#ded7c8]">
            <p className="text-xl sm:text-2xl font-black text-[#5f7d66]">
              {currentUser.onTimeReturnRate}%
            </p>
            <p className="text-[11px] text-[#67635c] font-medium mt-0.5">
              On-Time Rate
            </p>
          </div>
        </div>

        {/* Community Badges */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4e4a43] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#c86d51]" />
            <span>Community Badges Earned</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges?.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#ded7c8] text-xs font-bold text-[#24211d] shadow-2xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
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
