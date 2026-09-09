import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, Leaf, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-3 border-black mt-20 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ff90e8] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-black">
                JiranAid
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ffc900] border-2 border-black text-black shadow-[1.5px_1.5px_0px_#000]">
                Hyper-Local
              </span>
            </div>

            <p className="text-sm text-[#333] font-medium max-w-md leading-relaxed">
              JiranAid is a hyper-local neighborhood tool and appliance sharing platform. Why buy a power drill you only use once a year when you can borrow it from a verified neighbor next door?
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black bg-[#bbf7d0] text-black shadow-[2px_2px_0px_#000]">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Verified Neighbors Only</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black bg-[#faf9f6] text-black shadow-[2px_2px_0px_#000]">
                <Leaf className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Zero-Waste Communities</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff90e8] border border-black inline-block"></span>
              <span>Explore Library</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
              <li>
                <Link to="/items" className="text-[#333] hover:text-black hover:underline transition-colors">
                  All Tool Categories
                </Link>
              </li>
              <li>
                <Link to="/items?category=Power+Tools" className="text-[#333] hover:text-black hover:underline transition-colors">
                  Power Tools
                </Link>
              </li>
              <li>
                <Link to="/items?category=Gardening+%26+Yard" className="text-[#333] hover:text-black hover:underline transition-colors">
                  Gardening & Yard
                </Link>
              </li>
              <li>
                <Link to="/items?category=Cleaning+%26+Steam" className="text-[#333] hover:text-black hover:underline transition-colors">
                  Cleaning & Steam
                </Link>
              </li>
              <li>
                <Link to="/items/create" className="text-black font-black hover:bg-[#ffc900] px-1 py-0.5 rounded border border-transparent hover:border-black transition-all inline-block">
                  + List an Appliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Trust */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffc900] border border-black inline-block"></span>
              <span>Community & Trust</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
              <li>
                <Link to="/borrowings" className="text-[#333] hover:text-black hover:underline transition-colors">
                  Active Borrowings
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#333] hover:text-black hover:underline transition-colors">
                  Lender Dashboard
                </Link>
              </li>
              <li>
                <span className="text-[#333] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Geofenced by Postcode</span>
                </span>
              </li>
              <li>
                <span className="text-[#333]">
                  Refundable Security Deposits
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-black mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#555]">
          <p>© {new Date().getFullYear()} JiranAid Platform. Boldly built for neighborhoods.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#faf9f6] border border-black text-black font-mono text-[11px]">Taman Melawati (53100)</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-[#faf9f6] border border-black text-black font-mono text-[11px]">Subang Jaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
