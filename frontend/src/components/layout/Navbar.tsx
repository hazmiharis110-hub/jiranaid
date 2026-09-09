import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  Layers,
  Search,
  Menu,
  X,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useItemStore } from '../../store/useItemStore';

interface NavbarProps {
  onOpenNeighborhoodModal?: () => void;
  onOpenProfileModal?: () => void;
  pendingRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNeighborhoodModal,
  onOpenProfileModal,
  pendingRequestsCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentNeighborhood, logout } = useAuthStore();
  const { setSearchQuery } = useItemStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setSearchQuery(navSearch.trim());
      navigate(`/items?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/items');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 border-2 ${
      isActive
        ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000]'
        : 'text-black border-transparent hover:border-black hover:bg-[#ffc900] hover:shadow-[2px_2px_0px_#000]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6] border-b-2 border-black transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand & Neighborhood Selector */}
          <div className="flex items-center gap-2 sm:gap-5 min-w-0">
            <Link
              to="/"
              id="brand-logo"
              className="group flex items-center gap-2.5 shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff90e8] border-2 border-black flex items-center justify-center text-black shadow-[2.5px_2.5px_0px_#000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_#000] transition-all duration-150">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="hidden min-[380px]:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-2xl tracking-tight text-black">
                    JiranAid
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ffc900] border-2 border-black text-black shadow-[1.5px_1.5px_0px_#000]">
                    Local Library
                  </span>
                </div>
                <p className="text-[11px] text-[#444] font-bold hidden sm:block">
                  Borrow tools from verified neighbors
                </p>
              </div>
            </Link>

            {/* Neighborhood Location Badge & Switcher */}
            <button
              id="neighborhood-selector-btn"
              onClick={onOpenNeighborhoodModal}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#bbf7d0] text-left transition-all min-w-0 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              title="Click to verify or switch residential pool"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-[#bbf7d0] border border-black text-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </div>
              <div className="max-w-[100px] xs:max-w-[130px] sm:max-w-[170px] truncate">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-black text-black truncate">
                    {currentNeighborhood?.name || 'Local Circle'}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#555] font-bold block truncate">
                  {currentUser?.postcode || currentNeighborhood?.postcode || '53100'} • Verified
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-black group-hover:rotate-180 transition-transform shrink-0 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Bar in Desktop Header */}
          {location.pathname !== '/items' && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative max-w-xs w-full"
            >
              <Search className="w-4 h-4 text-black absolute left-3 pointer-events-none stroke-[2.5]" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Find drill, mower, ladder..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border-2 border-black bg-white text-xs font-bold text-black placeholder-[#777] shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000] focus:outline-none transition-all"
              />
            </form>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/items" className={navLinkClass}>
              <Package className="w-4 h-4 stroke-[2.2]" />
              <span>Catalog</span>
            </NavLink>

            <NavLink to="/borrowings" className={navLinkClass}>
              <Wrench className="w-4 h-4 stroke-[2.2]" />
              <span>Borrowings</span>
            </NavLink>

            <NavLink to="/dashboard" className={navLinkClass}>
              <Layers className="w-4 h-4 stroke-[2.2]" />
              <span>Dashboard</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#ff90e8] text-black border border-black text-[10px] font-black animate-bounce">
                  {pendingRequestsCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* List a Tool Button */}
            <Link
              to="/items/create"
              id="nav-create-item-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ffc900] text-black border-2 border-black text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List a Tool</span>
            </Link>

            {currentUser ? (
              /* Logged In User Pill with Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#ff90e8]/20 transition-all shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border-2 border-black"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-black text-black block leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-black font-black flex items-center gap-0.5">
                      ★ {(currentUser.trustScore ?? 5.0).toFixed(1)} Trust
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_#000] py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b-2 border-black bg-[#faf9f6]">
                        <p className="text-xs font-black text-black truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#555] font-bold truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenProfileModal) onOpenProfileModal();
                          else navigate('/profile');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-black hover:bg-[#ff90e8] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 stroke-[2.5]" />
                        <span>Trust Profile & Badges</span>
                      </button>

                      <Link
                        to="/items/create"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-black hover:bg-[#ffc900] flex items-center gap-2 transition-colors sm:hidden"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>List a Tool</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-black hover:bg-[#bbf7d0] flex items-center gap-2 transition-colors"
                      >
                        <Layers className="w-4 h-4 stroke-[2.5]" />
                        <span>Lender Dashboard</span>
                      </Link>

                      <div className="border-t-2 border-black my-1" />

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-100 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 stroke-[2.5]" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Logged Out Buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black text-black border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_#000] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black text-white hover:bg-[#ff90e8] hover:text-black border-2 border-black text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Join Circle
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t-2 border-black py-4 space-y-2 bg-[#faf9f6]"
            >
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <Search className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Find equipment..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-black bg-white text-sm font-bold text-black placeholder-[#777] shadow-[2px_2px_0px_#000]"
                />
              </form>

              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-black text-black hover:bg-[#ffc900] border-2 border-transparent hover:border-black transition-all"
              >
                Home
              </NavLink>
              <NavLink
                to="/items"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-black text-black hover:bg-[#ffc900] border-2 border-transparent hover:border-black transition-all"
              >
                Tool Catalog
              </NavLink>
              <NavLink
                to="/borrowings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-black text-black hover:bg-[#ffc900] border-2 border-transparent hover:border-black transition-all"
              >
                Borrowings & Loans
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-black text-black hover:bg-[#ffc900] border-2 border-transparent hover:border-black transition-all"
              >
                Lender Dashboard
              </NavLink>
              <NavLink
                to="/items/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-black bg-[#ffc900] text-black border-2 border-black shadow-[2px_2px_0px_#000] mt-2"
              >
                + List a Tool
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
