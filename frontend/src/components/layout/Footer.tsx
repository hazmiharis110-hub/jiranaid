import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, Leaf, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f4efe6] border-t border-[#ded7c8] mt-16 text-[#4e4a43]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#c86d51] flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#24211d]">
                JiranAid
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350]">
                Hyper-Local
              </span>
            </div>

            <p className="text-sm text-[#67635c] max-w-md leading-relaxed">
              JiranAid is a hyper-local neighborhood tool and appliance sharing platform. Why buy a drill you use once a year when you can borrow it from a verified neighbor next door?
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#496350]">
                <ShieldCheck className="w-4 h-4 text-[#5f7d66]" />
                <span>Verified Residents Only</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#496350]">
                <Leaf className="w-4 h-4 text-[#5f7d66]" />
                <span>Zero-Waste Neighborhoods</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24211d] mb-4">
              Explore Library
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/items" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  All Tool Categories
                </Link>
              </li>
              <li>
                <Link to="/items?category=Power+Tools" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  Power Tools
                </Link>
              </li>
              <li>
                <Link to="/items?category=Gardening+%26+Yard" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  Gardening & Yard
                </Link>
              </li>
              <li>
                <Link to="/items?category=Cleaning+%26+Steam" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  Cleaning & High Pressure
                </Link>
              </li>
              <li>
                <Link to="/items/create" className="text-[#c86d51] font-semibold hover:underline">
                  + List an Appliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24211d] mb-4">
              Community & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/borrowings" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  Active Borrowings
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#67635c] hover:text-[#c86d51] transition-colors">
                  Lender Dashboard
                </Link>
              </li>
              <li>
                <span className="text-[#67635c] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5f7d66]" />
                  <span>Geofenced by Postcode</span>
                </span>
              </li>
              <li>
                <span className="text-[#67635c]">
                  Refundable Security Deposits
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ded7c8] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a857b]">
          <p>© {new Date().getFullYear()} JiranAid Platform. Crafted with community care.</p>
          <div className="flex items-center gap-4">
            <span>Taman Melawati & Riverview</span>
            <span>•</span>
            <span>Section 7 Shah Alam</span>
            <span>•</span>
            <span>Bukit Damansara</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
