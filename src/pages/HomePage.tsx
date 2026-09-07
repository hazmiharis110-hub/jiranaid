import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Wrench,
  Search,
  ShieldCheck,
  Leaf,
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Lock,
  Star,
  Layers,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useItemStore } from '../store/useItemStore';
import { useAuthStore } from '../store/useAuthStore';
import { ItemCard } from '../components/items/ItemCard';
import type { ToolCategory, ToolItem } from '../types';

const CATEGORY_ITEMS: { name: Exclude<ToolCategory, 'All'>; icon: string; count: string }[] = [
  { name: 'Power Tools', icon: '⚡', count: '18 items' },
  { name: 'Gardening & Yard', icon: '🌿', count: '14 items' },
  { name: 'Cleaning & Steam', icon: '✨', count: '9 items' },
  { name: 'Home Improvement', icon: '🔨', count: '12 items' },
  { name: 'Ladders & Access', icon: '🪜', count: '6 items' },
  { name: 'Kitchen Appliances', icon: '🍲', count: '8 items' },
  { name: 'Woodworking', icon: '🪵', count: '5 items' },
  { name: 'Automotive', icon: '🚗', count: '4 items' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tools, stats, setSelectedCategory, setSearchQuery } = useItemStore();
  const { currentUser, currentNeighborhood } = useAuthStore();
  const [quickSearch, setQuickSearch] = useState('');

  const featuredTools = tools.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setSearchQuery(quickSearch.trim());
      navigate(`/items?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/items');
    }
  };

  const handleCategoryClick = (cat: ToolCategory) => {
    setSelectedCategory(cat);
    navigate(`/items?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-[#ede7db] bg-gradient-to-b from-[#f5ede1]/60 via-[#faf8f5] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Geofence verified badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5f7d66]/15 border border-[#5f7d66]/30 text-[#496350] text-xs sm:text-sm font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#5f7d66]" />
              <span>Verified Residential Pool: {currentNeighborhood?.name || 'Taman Melawati & Riverview'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#24211d] leading-[1.15]">
              Borrow Tools From Your <span className="text-[#c86d51]">Neighbors</span> Next Door
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#67635c] leading-relaxed max-w-2xl mx-auto">
              Why spend RM500+ buying a pressure washer, ladder, or cordless drill you only use once a year? JiranAid connects you with trusted neighbors for safe, low-cost equipment sharing.
            </p>

            {/* Big Hero Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-[#ded7c8] p-1.5">
                <Search className="w-5 h-5 text-[#8a857b] ml-3.5" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="What household project are you tackling today? (e.g. pressure washer, hedge trimmer)..."
                  className="w-full px-3.5 py-3 text-sm sm:text-base text-[#24211d] placeholder-[#8a857b] bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 sm:px-7 py-3 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-bold transition-all shrink-0 shadow-xs"
                >
                  Search Tools
                </button>
              </div>
            </form>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/items"
                className="px-5 py-2.5 rounded-xl bg-[#24211d] hover:bg-black text-[#faf8f5] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
              >
                <span>Browse All {tools.length} Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/items/create"
                className="px-5 py-2.5 rounded-xl border border-[#ded7c8] bg-white hover:bg-[#f4efe6] text-[#24211d] text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-[#c86d51]" />
                <span>List Your Equipment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Community Impact Live Counter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24211d] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#c86d51]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#5f7d66]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-4xl font-black text-white">
                RM{stats?.totalSavingsEstimate ? stats.totalSavingsEstimate.toLocaleString() : '16,400'}+
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
                Saved by Neighbors
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-4xl font-black text-[#9bc1a3]">
                {stats?.landfillWasteDivertedKg || 310} kg
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
                E-Waste Diverted
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-4xl font-black text-[#e9a593]">
                {tools.length || 68}
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
                Tools in Local Library
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-4xl font-black text-amber-400">
                100%
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
                Deposit Return Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24211d]">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#67635c] mt-1">
              Find exactly what you need for gardening, cleaning, repairs, and woodwork
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs sm:text-sm font-bold text-[#c86d51] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group p-4 sm:p-5 rounded-2xl border border-[#ded7c8] bg-[#fcfbf9] hover:bg-white hover:border-[#c86d51]/60 hover:shadow-md transition-all text-left flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f4efe6] group-hover:bg-[#c86d51]/10 text-xl flex items-center justify-center transition-colors">
                {cat.icon}
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-[#24211d] group-hover:text-[#c86d51] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#8a857b] font-medium mt-0.5">
                  {cat.count}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured Tools in Your Circle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5f7d66] animate-ping" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24211d]">
                Featured in Your Neighborhood
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#67635c] mt-1">
              Top rated household appliances ready to borrow today within 2km
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs sm:text-sm font-bold text-[#24211d] hover:text-[#c86d51] flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, idx) => (
            <ItemCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      </section>

      {/* 5. How JiranAid Works (4-Step Flow) */}
      <section className="bg-[#f4efe6]/70 border-y border-[#ded7c8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c86d51]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#24211d]">
              How Neighbor Sharing Works
            </h2>
            <p className="text-sm text-[#67635c]">
              Built with trust, geofencing, and automated security deposits so both lenders and borrowers have peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-[#ded7c8] p-6 text-left relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#24211d] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-[#24211d] mb-2">
                Find Your Tool
              </h3>
              <p className="text-xs text-[#67635c] leading-relaxed">
                Browse power tools, lawnmowers, and ladders listed by verified residents in your immediate postcode.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-[#ded7c8] p-6 text-left relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#c86d51] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-[#24211d] mb-2">
                Request & Book Dates
              </h3>
              <p className="text-xs text-[#67635c] leading-relaxed">
                Pick your required dates (1 to 5 days). Pay a small daily maintenance fee and a refundable security hold.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#ded7c8] p-6 text-left relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#5f7d66] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-[#24211d] mb-2">
                Local Porch Pickup
              </h3>
              <p className="text-xs text-[#67635c] leading-relaxed">
                Coordinate safe, phone-number-free chat with the owner and collect the item just a few streets away.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-[#ded7c8] p-6 text-left relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-[#24211d] mb-2">
                Return & Deposit Released
              </h3>
              <p className="text-xs text-[#67635c] leading-relaxed">
                Return the item clean. The owner confirms inspection, and your deposit hold is instantly released back to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust & Security Pillar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fcfbf9] rounded-3xl border border-[#ded7c8] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5f7d66]">
                Safety Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#24211d]">
                Community Safety & Verified Residence
              </h2>
              <p className="text-sm text-[#67635c] leading-relaxed">
                We believe trust is built through proximity and transparency. Unlike broad classified sites, JiranAid pools are bounded by local postcodes so everyone you meet is a real neighbor.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#5f7d66]/15 text-[#496350] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24211d]">Geofenced Verification</h4>
                    <p className="text-xs text-[#67635c]">Only residents who verify their address or GPS can view item locations and request borrows.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#5f7d66]/15 text-[#496350] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24211d]">Refundable Deposit Guarantee</h4>
                    <p className="text-xs text-[#67635c]">Lenders are protected by security deposits held during active borrowing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#5f7d66]/15 text-[#496350] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24211d]">Neighbor Trust Scores & Reviews</h4>
                    <p className="text-xs text-[#67635c]">Track record of on-time returns, item care ratings, and community badges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-[#f4efe6] rounded-2xl border border-[#ded7c8] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ded7c8] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5f7d66]" />
                  <span className="text-sm font-bold text-[#24211d]">Neighborhood Trust Metric</span>
                </div>
                <span className="text-xs font-bold text-[#496350] bg-[#5f7d66]/20 px-2 py-0.5 rounded-full">
                  Level 1 Protected
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#4e4a43]">
                <div className="flex justify-between py-1 border-b border-[#ede7db]">
                  <span>Active Neighbors in Pool</span>
                  <span className="font-bold">{stats?.totalNeighbors || 142} verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ede7db]">
                  <span>Equipment Return Rate</span>
                  <span className="font-bold text-[#5f7d66]">99.8% on-time</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ede7db]">
                  <span>Community Savings to Date</span>
                  <span className="font-bold">RM16,400+</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Current Residential Hub</span>
                  <span className="font-bold">{currentNeighborhood?.name || 'Taman Melawati'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="w-full py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Join Your Local Neighborhood Pool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#24211d] to-[#453e35] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black max-w-xl mx-auto">
            Got tools gathering dust in your storeroom?
          </h2>
          <p className="text-stone-300 text-sm max-w-lg mx-auto">
            Put them to work! Help a neighbor complete their home project, earn small maintenance fees, and earn trusted community badges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/items/create"
              className="px-6 py-3 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>List Your First Tool (Takes 1 Minute)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
