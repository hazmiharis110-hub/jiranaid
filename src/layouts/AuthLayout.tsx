import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, Users, Sparkles } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#faf8f5]">
      {/* Left side banner (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#24211d] to-[#3a352f] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c86d51]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5f7d66]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c86d51] flex items-center justify-center text-white shadow-md">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">JiranAid</span>
          </Link>
          <p className="mt-2 text-sm text-stone-300">
            Hyper-Local Neighborhood Tool & Appliance Sharing Platform
          </p>
        </div>

        {/* Community Highlights */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wide uppercase">Community First</span>
            </div>
            <p className="text-stone-200 text-sm leading-relaxed">
              "Instead of buying an expensive pressure washer that sits in the garage 360 days a year, I borrowed one from Encik Rahman across the street. Saved RM450 in an afternoon!"
            </p>
            <p className="mt-3 text-xs font-semibold text-stone-400">
              — Sarah Lim, Verified Resident of Taman Melawati
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5f7d66]/40 flex items-center justify-center text-[#9bc1a3]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">100% Verified</p>
                <p className="text-[11px] text-stone-400">Postcode & GPS bound</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#c86d51]/40 flex items-center justify-center text-[#e9a593]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Trusted Circle</p>
                <p className="text-[11px] text-stone-400">Secure refundable deposits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} JiranAid Platform. Share more, waste less.</p>
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#c86d51] flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-[#24211d]">JiranAid</span>
            </Link>
          </div>

          {/* Form Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
