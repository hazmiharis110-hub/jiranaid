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
  const { filters, setSearchQuery } = useItemStore();

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
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'bg-[#24211d] text-[#faf8f5] shadow-xs'
        : 'text-[#4e4a43] hover:text-[#24211d] hover:bg-[#ede7db]'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d7] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Neighborhood Selector */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link
              to="/"
              id="brand-logo"
              className="group flex items-center gap-2.5 shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c86d51] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                <Wrench className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="hidden min-[380px]:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#24211d] group-hover:text-[#c86d51] transition-colors">
                    JiranAid
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350]">
                    Local Library
                  </span>
                </div>
                <p className="text-[11px] text-[#67635c] font-medium hidden sm:block">
                  Share tools with verified neighbors
                </p>
              </div>
            </Link>

            {/* Neighborhood Location Badge & Switcher */}
            <motion.button
              id="neighborhood-selector-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenNeighborhoodModal}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#ded7c8] bg-[#f4efe6] hover:bg-[#eae3d5] hover:border-[#5f7d66]/50 text-left transition-all min-w-0 shadow-2xs"
              title="Click to verify or switch residential pool"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-[#5f7d66] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="max-w-[100px] xs:max-w-[130px] sm:max-w-[170px] truncate">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-[#24211d] truncate">
                    {currentNeighborhood?.name || 'Local Circle'}
                  </span>
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5f7d66] shrink-0" />
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#67635c] block truncate">
                  {currentUser?.postcode || currentNeighborhood?.postcode || '53100'} • Verified Pool
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#67635c] group-hover:text-[#24211d] transition-colors shrink-0" />
            </motion.button>
          </div>

          {/* Search Bar in Desktop Header */}
          {location.pathname !== '/items' && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative max-w-xs w-full"
            >
              <Search className="w-4 h-4 text-[#8a857b] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Find drill, mower, ladder..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-xs font-medium text-[#24211d] placeholder-[#8a857b] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51] transition-all"
              />
            </form>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/items" className={navLinkClass}>
              <Package className="w-4 h-4" />
              <span>Catalog</span>
            </NavLink>

            <NavLink to="/borrowings" className={navLinkClass}>
              <Wrench className="w-4 h-4" />
              <span>Borrowings</span>
            </NavLink>

            <NavLink to="/dashboard" className={navLinkClass}>
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#c86d51] text-white animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* List a Tool Button */}
            <Link
              to="/items/create"
              id="nav-create-item-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List a Tool</span>
            </Link>

            {currentUser ? (
              /* Logged In User Pill with Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 sm:pr-2.5 py-1 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] hover:bg-[#f2ece2] hover:border-[#c86d51]/40 transition-all shadow-2xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#e8e2d7]"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-[#24211d] block leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#5f7d66] font-semibold">
                      ★ {(currentUser.trustScore ?? 5.0).toFixed(1)} Trust
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#67635c]" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#ded7c8] shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-[#f1ede4]">
                        <p className="text-xs font-bold text-[#24211d] truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#8a857b] truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenProfileModal) onOpenProfileModal();
                          else navigate('/profile');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4e4a43] hover:bg-[#faf8f5] hover:text-[#24211d] flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-[#8a857b]" />
                        <span>Trust Profile & Badges</span>
                      </button>

                      <Link
                        to="/items/create"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4e4a43] hover:bg-[#faf8f5] hover:text-[#24211d] flex items-center gap-2 sm:hidden"
                      >
                        <Plus className="w-4 h-4 text-[#8a857b]" />
                        <span>List a Tool</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4e4a43] hover:bg-[#faf8f5] hover:text-[#24211d] flex items-center gap-2"
                      >
                        <Layers className="w-4 h-4 text-[#8a857b]" />
                        <span>Lender Dashboard</span>
                      </Link>

                      <div className="border-t border-[#f1ede4] my-1" />

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Logged Out Buttons */
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#4e4a43] hover:text-[#24211d] hover:bg-[#f2ece2] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#24211d] hover:bg-black text-[#faf8f5] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all"
                >
                  Join Circle
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-[#24211d]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="md:hidden border-t border-[#e8e2d7] py-4 space-y-2 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <Search className="w-4 h-4 text-[#8a857b] absolute left-3 top-3" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Find equipment..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ded7c8] bg-white text-sm"
                />
              </form>

              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211d] hover:bg-[#ede7db]"
              >
                Home
              </NavLink>
              <NavLink
                to="/items"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211d] hover:bg-[#ede7db]"
              >
                Tool Catalog
              </NavLink>
              <NavLink
                to="/borrowings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211d] hover:bg-[#ede7db]"
              >
                Borrowings & Loans
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211d] hover:bg-[#ede7db]"
              >
                Lender Dashboard
              </NavLink>
              <NavLink
                to="/items/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#c86d51] hover:bg-[#ede7db]"
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
