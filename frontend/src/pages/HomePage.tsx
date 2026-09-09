import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
} from "lucide-react";
import { useItemStore } from "../store/useItemStore";
import { useAuthStore } from "../store/useAuthStore";
import { ItemCard } from "../components/items/ItemCard";
import type { ToolCategory, ToolItem } from "../types";

const CATEGORY_ITEMS: { name: Exclude<ToolCategory, "All">; icon: string }[] = [
  { name: "Power Tools", icon: "⚡" },
  { name: "Gardening & Yard", icon: "🌿" },
  { name: "Cleaning & Steam", icon: "✨" },
  { name: "Home Improvement", icon: "🔨" },
  { name: "Ladders & Access", icon: "🪜" },
  { name: "Kitchen Appliances", icon: "🍲" },
  { name: "Woodworking", icon: "🪵" },
  { name: "Automotive", icon: "🚗" },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tools, fetchTools } = useItemStore();
  const { currentUser, currentNeighborhood } = useAuthStore();
  const [quickSearch, setQuickSearch] = useState("");

  React.useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const inventory = tools;
  const featuredTools = inventory.slice(0, 4);
  const communityStats = {
    totalSavingsEstimate: 16400,
    landfillWasteDivertedKg: 310,
    totalNeighbors: 142,
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/items?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate("/items");
    }
  };

  const handleCategoryClick = (cat: ToolCategory) => {
    navigate(`/items?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b-3 border-black bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Geofence verified badge */}
            <div className="jn-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#bbf7d0] border-2 border-black text-black text-xs sm:text-sm font-mono font-black shadow-[2.5px_2.5px_0px_#000]">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>
                Verified Residential Pool:{" "}
                {currentNeighborhood?.name || "Taman Melawati & Riverview"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.08]">
              Borrow Tools From Your{" "}
              <span className="bg-[#ffc900] px-3 py-0.5 border-2 border-black inline-block -rotate-1 shadow-[3px_3px_0px_#000]">
                Neighbors
              </span>{" "}
              Next Door
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-neutral-800 font-medium leading-relaxed max-w-2xl mx-auto">
              Why spend RM500+ buying a pressure washer, ladder, or cordless
              drill you only use once a year? JiranAid connects you with trusted
              neighbors for safe, low-cost equipment sharing.
            </p>

            {/* Big Hero Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="max-w-2xl mx-auto pt-2"
            >
              <div className="relative flex items-center rounded-2xl bg-white border-3 border-black p-2 shadow-[5px_5px_0px_#000]">
                <Search className="w-5 h-5 text-black ml-3 stroke-[2.5]" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="What household project are you tackling today?..."
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base font-bold text-black placeholder:text-neutral-500 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="jn-btn px-5 sm:px-7 py-3 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-sm font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer"
                >
                  Search Tools
                </button>
              </div>
            </form>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/items"
                className="jn-btn px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
              >
                <span>Browse All {inventory.length} Tools</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/items/create"
                className="jn-btn px-6 py-3 rounded-xl border-2 border-black bg-white hover:bg-[#ffc900] text-black text-xs sm:text-sm font-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 stroke-[2.5]" />
                <span>List Your Equipment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Community Impact Live Counter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ff90e8] text-black rounded-3xl border-3 border-black p-6 sm:p-10 shadow-[6px_6px_0px_#000] relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-5xl font-black font-mono text-black">
                RM{communityStats.totalSavingsEstimate.toLocaleString()}+
              </p>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-black mt-1">
                Saved by Neighbors
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-5xl font-black font-mono text-black">
                {communityStats.landfillWasteDivertedKg} kg
              </p>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-black mt-1">
                E-Waste Diverted
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-5xl font-black font-mono text-black">
                {tools.length || 68}
              </p>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-black mt-1">
                Tools in Local Library
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-5xl font-black font-mono text-black">
                100%
              </p>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-black mt-1">
                Deposit Return Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-1">
              Find exactly what you need for gardening, cleaning, repairs, and
              woodwork
            </p>
          </div>
          <Link
            to="/items"
            className="jn-btn self-start sm:self-auto text-xs sm:text-sm font-black text-black bg-white hover:bg-[#ffc900] border-2 border-black rounded-xl px-4 py-2 shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORY_ITEMS.map((cat) => {
            const count = inventory.filter(
              (t) => t.category === cat.name,
            ).length;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-4 sm:p-5 rounded-2xl border-2 border-black bg-white hover:bg-[#ffc900] shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#faf9f6] group-hover:bg-white border-2 border-black text-2xl flex items-center justify-center shadow-[2px_2px_0px_#000] transition-colors">
                  {cat.icon}
                </div>
                <div className="mt-4">
                  <h3 className="font-black text-sm sm:text-base text-black group-hover:text-black transition-colors">
                    {cat.name}
                  </h3>
                  <div className="mt-1.5">
                    <span className="jn-badge bg-[#bbf7d0] text-black border border-black rounded-md px-1.5 py-0.5 font-mono font-black text-[10px] shadow-[1px_1px_0px_#000]">
                      {count === 1 ? "1 tool" : `${count} tools`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Tools in Your Circle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#ffc900] border-2 border-black animate-pulse" />
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Featured in Your Neighborhood
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-1">
              Top rated household appliances ready to borrow today within 2km
            </p>
          </div>
          <Link
            to="/items"
            className="jn-btn self-start sm:self-auto text-xs sm:text-sm font-black text-black bg-white hover:bg-[#ffc900] border-2 border-black rounded-xl px-4 py-2 shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, idx) => (
            <ItemCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      </section>

      {/* 5. How JiranAid Works (4-Step Flow) */}
      <section className="bg-[#faf9f6] border-y-3 border-black py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="jn-badge inline-block bg-[#ffc900] text-black border-2 border-black rounded-lg px-3 py-1 text-xs font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              How Neighbor Sharing Works
            </h2>
            <p className="text-sm sm:text-base font-bold text-neutral-700">
              Built with trust, geofencing, and automated security deposits so
              both lenders and borrowers have peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border-2 border-black p-6 text-left relative shadow-[4px_4px_0px_#000]">
              <div className="w-11 h-11 rounded-xl bg-[#ff90e8] text-black border-2 border-black flex items-center justify-center font-black font-mono text-lg mb-4 shadow-[2px_2px_0px_#000]">
                1
              </div>
              <h3 className="font-black text-base text-black mb-2">
                Find Your Tool
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                Browse power tools, lawnmowers, and ladders listed by verified
                residents in your immediate postcode.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border-2 border-black p-6 text-left relative shadow-[4px_4px_0px_#000]">
              <div className="w-11 h-11 rounded-xl bg-[#ffc900] text-black border-2 border-black flex items-center justify-center font-black font-mono text-lg mb-4 shadow-[2px_2px_0px_#000]">
                2
              </div>
              <h3 className="font-black text-base text-black mb-2">
                Request & Book Dates
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                Pick your required dates (1 to 5 days). Pay a small daily
                maintenance fee and a refundable security hold.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border-2 border-black p-6 text-left relative shadow-[4px_4px_0px_#000]">
              <div className="w-11 h-11 rounded-xl bg-[#bbf7d0] text-black border-2 border-black flex items-center justify-center font-black font-mono text-lg mb-4 shadow-[2px_2px_0px_#000]">
                3
              </div>
              <h3 className="font-black text-base text-black mb-2">
                Local Porch Pickup
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                Coordinate safe, phone-number-free chat with the owner and
                collect the item just a few streets away.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border-2 border-black p-6 text-left relative shadow-[4px_4px_0px_#000]">
              <div className="w-11 h-11 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-black font-mono text-lg mb-4 shadow-[2px_2px_0px_#ff90e8]">
                4
              </div>
              <h3 className="font-black text-base text-black mb-2">
                Return & Deposit Released
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                Return the item clean. The owner confirms inspection, and your
                deposit hold is instantly released back to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust & Security Pillar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border-3 border-black p-8 sm:p-12 shadow-[6px_6px_0px_#000]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="jn-badge inline-block bg-[#bbf7d0] text-black border-2 border-black rounded-lg px-3 py-1 text-xs font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                Safety Guarantee
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                Community Safety & Verified Residence
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 font-medium leading-relaxed">
                We believe trust is built through proximity and transparency.
                Unlike broad classified sites, JiranAid pools are bounded by
                local postcodes so everyone you meet is a real neighbor.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#ffc900] border-2 border-black text-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_#000]">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Geofenced Verification
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                      Only residents who verify their address or GPS can view
                      item locations and request borrows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#ff90e8] border-2 border-black text-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_#000]">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Refundable Deposit Guarantee
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                      Lenders are protected by security deposits held during
                      active borrowing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#bbf7d0] border-2 border-black text-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_#000]">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Neighbor Trust Scores & Reviews
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                      Track record of on-time returns, item care ratings, and
                      community badges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-[#fffdf0] rounded-2xl border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
                  <span className="text-sm font-black text-black">
                    Neighborhood Trust Metric
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-black bg-[#bbf7d0] border border-black px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#000]">
                  Level 1 Protected
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-800 font-bold">
                <div className="flex justify-between py-1.5 border-b border-neutral-200">
                  <span>Active Neighbors in Pool</span>
                  <span className="font-mono font-black">
                    {communityStats.totalNeighbors} verified
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-200">
                  <span>Equipment Return Rate</span>
                  <span className="font-mono font-black text-emerald-700 bg-[#bbf7d0] px-1 rounded">
                    99.8% on-time
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-200">
                  <span>Community Savings to Date</span>
                  <span className="font-mono font-black">RM16,400+</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Current Residential Hub</span>
                  <span className="font-black">
                    {currentNeighborhood?.name || "Taman Melawati"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="jn-btn w-full py-3.5 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <span>Join Your Local Neighborhood Pool</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#ffc900] text-black rounded-3xl border-3 border-black p-8 sm:p-14 text-center space-y-6 shadow-[6px_6px_0px_#000]">
          <h2 className="text-3xl sm:text-5xl font-black max-w-xl mx-auto leading-tight tracking-tight">
            Got tools gathering dust in your storeroom?
          </h2>
          <p className="text-neutral-800 font-bold text-sm sm:text-base max-w-lg mx-auto">
            Put them to work! Help a neighbor complete their home project, earn
            small maintenance fees, and earn trusted community badges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/items/create"
              className="jn-btn px-8 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm sm:text-base font-black border-2 border-black shadow-[4px_4px_0px_#ff90e8] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all inline-flex items-center gap-2.5"
            >
              <Wrench className="w-4 h-4 stroke-[2.5]" />
              <span>List Your First Tool (Takes 1 Minute)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
