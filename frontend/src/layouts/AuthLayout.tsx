import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, Users, Sparkles } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#faf9f6]">
      {/* Left side banner (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#ffc900] text-black p-12 flex-col justify-between relative overflow-hidden border-r-3 border-black">
        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff90e8] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-3xl font-black tracking-tight text-black">JiranAid</span>
          </Link>
          <p className="mt-2 text-sm font-bold text-neutral-800">
            Hyper-Local Neighborhood Tool & Appliance Sharing Platform
          </p>
        </div>

        {/* Community Highlights */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="bg-white p-7 rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000]">
            <div className="flex items-center gap-2.5 text-black mb-3">
              <span className="jn-badge bg-[#bbf7d0] border-2 border-black px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase shadow-[1.5px_1.5px_0px_#000]">
                Community First
              </span>
            </div>
            <p className="text-black text-sm sm:text-base font-bold leading-relaxed">
              "Instead of buying an expensive pressure washer that sits in the garage 360 days a year, I borrowed one from Encik Rahman across the street. Saved RM450 in an afternoon!"
            </p>
            <p className="mt-4 text-xs font-mono font-black text-neutral-700">
              — Sarah Lim, Verified Resident of Taman Melawati
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000]">
              <div className="w-10 h-10 rounded-xl bg-[#bbf7d0] border-2 border-black flex items-center justify-center text-black shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-black">100% Verified</p>
                <p className="text-[11px] font-bold text-neutral-600">Postcode & GPS bound</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000]">
              <div className="w-10 h-10 rounded-xl bg-[#ff90e8] border-2 border-black flex items-center justify-center text-black shrink-0">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-black">Trusted Circle</p>
                <p className="text-[11px] font-bold text-neutral-600">Protected deposits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs font-bold text-neutral-800">
          <p>© {new Date().getFullYear()} JiranAid Platform. Share more, waste less.</p>
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#ff90e8] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-black tracking-tight">JiranAid</span>
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
