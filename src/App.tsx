import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  Tag,
  Sparkles,
  Wrench,
  DollarSign,
  Leaf,
  Users,
  AlertCircle,
  Plus,
  Compass,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import type {
  ToolItem,
  User,
  Neighborhood,
  BorrowRequest,
  ChatMessage,
  Review,
  ToolCategory,
} from "./types.ts";
import { Header } from "./components/Header.tsx";
import { NeighborhoodModal } from "./components/NeighborhoodModal.tsx";
import { ToolCard } from "./components/ToolCard.tsx";
import { ToolDetailModal } from "./components/ToolDetailModal.tsx";
import { AddToolModal } from "./components/AddToolModal.tsx";
import { BorrowRequestsView } from "./components/BorrowRequestsView.tsx";
import { ChatModal } from "./components/ChatModal.tsx";
import { UserProfileModal } from "./components/UserProfileModal.tsx";
import { ReviewModal } from "./components/ReviewModal.tsx";
import { BottomNav } from "./components/BottomNav.tsx";
import { AuthModal } from "./components/AuthModal.tsx";
import { LenderDashboard } from "./components/LenderDashboard.tsx";

const CATEGORIES: ToolCategory[] = [
  "All",
  "Gardening & Yard",
  "Power Tools",
  "Home Improvement",
  "Cleaning & Steam",
  "Kitchen Appliances",
  "Automotive",
  "Ladders & Access",
  "Woodworking",
];

export default function App() {
  // Navigation tabs: 'catalog' | 'requests' | 'chat' | 'lender'
  const [activeTab, setActiveTab] = useState<
    "catalog" | "requests" | "chat" | "lender"
  >("catalog");

  // Application Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [communityStats, setCommunityStats] = useState({
    totalTools: 68,
    availableTools: 54,
    activeBorrows: 14,
    totalNeighbors: 142,
    totalSavingsEstimate: 14850,
    landfillWasteDivertedKg: 310,
  });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [maxFeeFilter, setMaxFeeFilter] = useState<string>("all");

  // Modals & Drawers States
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedToolForDetail, setSelectedToolForDetail] =
    useState<ToolItem | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatTarget, setActiveChatTarget] = useState<{
    requestId?: string;
    toolTitle?: string;
    otherUserId: string;
    otherUserName: string;
  } | null>(null);
  const [selectedRequestForReview, setSelectedRequestForReview] =
    useState<BorrowRequest | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialAction, setAuthInitialAction] = useState<
    string | undefined
  >(undefined);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial Data Fetching
  const fetchAllData = async () => {
    try {
      // 1. Current user
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
        setAllUsers(userData.allUsers || []);
      }

      // 2. Neighborhoods
      const neighRes = await fetch("/api/neighborhoods");
      if (neighRes.ok) {
        const neighData = await neighRes.json();
        setNeighborhoods(neighData.neighborhoods || []);
      }

      // 3. Tools
      await fetchTools();

      // 4. Requests
      const reqRes = await fetch("/api/borrow-requests");
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setBorrowRequests(reqData.requests || []);
      }

      // 5. Messages
      const msgRes = await fetch("/api/messages");
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }

      // 6. Reviews
      const revRes = await fetch("/api/reviews");
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.reviews || []);
      }

      // 7. Community Stats
      const statsRes = await fetch("/api/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setCommunityStats(statsData.stats);
      }
    } catch (err) {
      console.error("Error fetching JiranAid data:", err);
    }
  };

  const fetchTools = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedCategory !== "All")
        params.append("category", selectedCategory);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sortBy) params.append("sort", sortBy);
      if (maxFeeFilter !== "all") params.append("maxFee", maxFeeFilter);

      const res = await fetch(`/api/tools?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (err) {
      console.error("Error fetching tools:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchTools();
  }, [searchQuery, selectedCategory, statusFilter, sortBy, maxFeeFilter]);

  // Current Neighborhood object
  const currentNeighborhood =
    neighborhoods.find((n) => n.id === currentUser?.neighborhoodId) ||
    neighborhoods[0] ||
    null;

  // Handlers
  const handleOpenAuthModal = (intendedAction?: string) => {
    setAuthInitialAction(intendedAction);
    setIsAuthModalOpen(true);
  };

  const handleLogin = async (credentials: {
    email?: string;
    userId?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${data.user.name}!`);

        // Refresh all users list and borrow requests
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const uData = await userRes.json();
          setAllUsers(uData.allUsers || []);
        }
        const reqRes = await fetch("/api/borrow-requests");
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setBorrowRequests(reqData.requests || []);
        }
      } else {
        const errData = await res.json();
        showToast(errData.message || errData.error || "Failed to sign in");
      }
    } catch (err) {
      console.error("Failed to log in:", err);
      showToast("Login failed. Please check network connection.");
    }
  };

  const handleSignUp = async (userData: {
    name: string;
    email: string;
    phone: string;
    neighborhoodId: string;
    postcode: string;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        showToast(`Welcome to JiranAid, ${data.user.name}!`);

        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const uData = await userRes.json();
          setAllUsers(uData.allUsers || []);
        }
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to sign up");
      }
    } catch (err) {
      console.error("Failed to sign up:", err);
      showToast("Registration failed. Please check network connection.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        setCurrentUser(null);
        setBorrowRequests([]);
        showToast("You have been signed out.");
      }
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const handleAddTool = async (toolData: any) => {
    if (!currentUser) {
      handleOpenAuthModal("Please log in to share or list a household tool.");
      return;
    }

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toolData),
      });
      if (res.ok) {
        const data = await res.json();
        setTools((prev) => [data.tool, ...prev]);
        showToast(
          `Listed "${data.tool.title}" in ${currentUser?.neighborhoodName}!`,
        );
      }
    } catch (err) {
      console.error("Failed to create tool listing:", err);
    }
  };

  const handleBorrowSubmit = async (
    tool: ToolItem,
    startDate: string,
    endDate: string,
    note: string,
  ) => {
    try {
      const res = await fetch("/api/borrow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          startDate,
          endDate,
          purposeNote: note,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBorrowRequests((prev) => [data.request, ...prev]);
        showToast(
          `Request sent to ${tool.ownerName}! Check 'My Requests & Loans'.`,
        );
        // Refresh messages
        const msgRes = await fetch("/api/messages");
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages || []);
        }
      }
    } catch (err) {
      console.error("Failed to submit borrow request:", err);
    }
  };

  const handleUpdateStatus = async (
    requestId: string,
    status: string,
    action?: string,
  ) => {
    try {
      const res = await fetch(`/api/borrow-requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setBorrowRequests((prev) =>
          prev.map((r) => (r.id === requestId ? data.request : r)),
        );
        fetchTools(); // status of tool might change to 'borrowed' or 'available'
        showToast(data.message || "Request status updated.");
      }
    } catch (err) {
      console.error("Failed to update request status:", err);
    }
  };

  const handleSendMessage = async (
    receiverId: string,
    receiverName: string,
    message: string,
    toolTitle?: string,
  ) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId,
          receiverName,
          message,
          toolTitle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.review, ...prev]);
        showToast(
          "Thank you for rating and keeping neighborhood trust strong!",
        );
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch("/api/auth/switch-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        // Refresh requests for newly active user
        const reqRes = await fetch("/api/borrow-requests");
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setBorrowRequests(reqData.requests || []);
        }
        showToast(`Switched active neighbor to ${data.user.name}`);
      }
    } catch (err) {
      console.error("Failed to switch user:", err);
    }
  };

  const handleVerifyAndSwitchNeighborhood = async (
    neighborhoodId: string,
    postcode: string,
    method: "gps" | "postcode",
  ) => {
    try {
      const res = await fetch("/api/auth/verify-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neighborhoodId, postcode, method }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        fetchTools();
        showToast(
          `Bound to ${data.user.neighborhoodName} (${data.user.postcode})`,
        );
      }
    } catch (err) {
      console.error("Failed to update neighborhood:", err);
    }
  };

  const handleSignUpNewUser = async (name: string, email: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          neighborhoodId: currentUser?.neighborhoodId,
          postcode: currentUser?.postcode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setAllUsers((prev) => [...prev, data.user]);
        showToast(`Welcome neighbor ${data.user.name}!`);
      }
    } catch (err) {
      console.error("Failed to sign up:", err);
    }
  };

  const handleOpenChatWithOwner = (tool: ToolItem) => {
    setActiveChatTarget({
      toolTitle: tool.title,
      otherUserId: tool.ownerId,
      otherUserName: tool.ownerName,
    });
    setIsChatModalOpen(true);
  };

  const handleOpenChatFromRequest = (
    requestId: string,
    toolTitle: string,
    otherUserId: string,
    otherUserName: string,
  ) => {
    setActiveChatTarget({
      requestId,
      toolTitle,
      otherUserId,
      otherUserName,
    });
    setIsChatModalOpen(true);
  };

  // Pending requests for current user as lender
  const pendingRequestsCount = borrowRequests.filter(
    (r) => r.ownerId === currentUser?.id && r.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#24211d] flex flex-col font-sans pb-20 md:pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#24211d] text-[#faf8f5] px-4 py-2.5 rounded-xl shadow-lg border border-[#4e4a43] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5f7d66]" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Top Sticky Header */}
      <Header
        currentUser={currentUser}
        currentNeighborhood={currentNeighborhood}
        activeTab={activeTab === "chat" ? "feedback" : activeTab}
        pendingRequestsCount={pendingRequestsCount}
        unreadMessagesCount={messages.length > 0 ? 1 : 0}
        onSelectTab={(tab) => setActiveTab(tab === "feedback" ? "chat" : tab)}
        onOpenAddModal={() => setIsAddToolModalOpen(true)}
        onOpenNeighborhoodModal={() => setIsNeighborhoodModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAuthModal={() => handleOpenAuthModal()}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === "catalog" && (
          <div>
            {/* Neighborhood Community Banner & Verification Anchor */}
            <div className="bg-[#f4efe6] border-b border-[#ded7c8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5f7d66]/15 border border-[#5f7d66]/30 text-[#496350] text-xs font-bold shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5f7d66] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5f7d66]"></span>
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Hyper-Local Residential Pool:{" "}
                      {currentNeighborhood?.name || "Local Circle"}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#24211d] tracking-tight">
                      Borrow What You Need. Share What You Own.
                    </h1>
                    <p className="text-xs sm:text-sm text-[#67635c] max-w-2xl leading-relaxed">
                      High pressure washers, lawn trimmers, power drills, and
                      kitchen appliances sitting idle in neighbor garages —
                      reserved safely with 100% refundable deposits.
                    </p>
                  </div>

                  {/* Impact Stats Pills with Interactive Hover Lift */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="p-3 sm:p-4 rounded-xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/50 hover:shadow-md transition-all duration-200 text-center cursor-default"
                    >
                      <div className="text-base sm:text-xl font-extrabold text-[#c86d51]">
                        {tools.length}
                      </div>
                      <div className="text-[10px] text-[#67635c] font-semibold">
                        Local Tools
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="p-3 sm:p-4 rounded-xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#5f7d66]/50 hover:shadow-md transition-all duration-200 text-center cursor-default"
                    >
                      <div className="text-base sm:text-xl font-extrabold text-[#5f7d66]">
                        RM{" "}
                        {communityStats.totalSavingsEstimate.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#67635c] font-semibold">
                        Saved Locally
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="p-3 sm:p-4 rounded-xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#24211d]/40 hover:shadow-md transition-all duration-200 text-center cursor-default"
                    >
                      <div className="text-base sm:text-xl font-extrabold text-[#24211d]">
                        {communityStats.landfillWasteDivertedKg} kg
                      </div>
                      <div className="text-[10px] text-[#67635c] font-semibold">
                        Waste Diverted
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search, Filter & Catalog Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
              {/* Search Bar & Primary Filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input with Dynamic Focus Ring */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8c867b] absolute left-3.5 top-3.5 transition-colors" />
                    <input
                      id="search-tools-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools by name, brand, or project (e.g. drill, lawn, Kärcher)..."
                      className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/30 focus:border-[#c86d51] placeholder:text-[#8c867b] transition-all shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-[#ded7c8]/60 hover:bg-[#ded7c8] text-xs font-semibold text-[#4e4a43] hover:text-[#24211d] transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <select
                        id="sort-by-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/30 focus:border-[#c86d51] transition-all shadow-2xs cursor-pointer"
                      >
                        <option value="distance">
                          Distance: Nearest to Me
                        </option>
                        <option value="fee-low">Fee: Lowest Daily Fee</option>
                        <option value="rating">
                          Owner Trust Rating (High)
                        </option>
                        <option value="newest">Recently Listed</option>
                      </select>
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="relative shrink-0">
                      <select
                        id="status-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/30 focus:border-[#c86d51] transition-all shadow-2xs cursor-pointer"
                      >
                        <option value="all">Status: All Items</option>
                        <option value="available">Available Now Only</option>
                        <option value="borrowed">Currently Borrowed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills Bar with Motion Animations */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        id={`category-pill-${cat}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "border-[#c86d51] bg-[#fbeee9] text-[#b0553b] shadow-xs font-bold"
                            : "border-[#ded7c8] bg-[#fcfbf9] text-[#67635c] hover:bg-[#ede7db] hover:text-[#24211d] hover:border-[#c86d51]/40"
                        }`}
                      >
                        {cat}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Tools Counter and Quick Location Anchor */}
              <div className="flex items-center justify-between text-xs text-[#67635c] border-b border-[#e8e2d7] pb-3">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-[#24211d] font-bold">
                      {tools.length} tools
                    </strong>{" "}
                    available in{" "}
                    <span className="font-semibold text-[#5f7d66]">
                      {currentNeighborhood?.name}
                    </span>
                  </span>
                  {(searchQuery ||
                    selectedCategory !== "All" ||
                    statusFilter !== "all") && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c86d51]"></span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsNeighborhoodModalOpen(true)}
                  className="text-xs text-[#c86d51] hover:underline font-semibold flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  Change Geofence
                </motion.button>
              </div>

              {/* Tools Grid with Smooth AnimatePresence and Motion */}
              {tools.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#ded7c8] bg-[#fcfbf9]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f4efe6] text-[#8c867b] flex items-center justify-center mx-auto mb-3">
                    <Wrench className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h3 className="text-base font-bold text-[#24211d]">
                    No tools match your criteria
                  </h3>
                  <p className="text-xs text-[#67635c] max-w-sm mx-auto mt-1 mb-4">
                    Try clearing search queries or switching categories. You can
                    also be the first to share this tool with neighbors!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#ede7db] text-xs font-semibold text-[#24211d] shadow-2xs transition-colors"
                  >
                    Reset All Filters
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {tools.map((tool, idx) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        index={idx}
                        onSelect={(t) => setSelectedToolForDetail(t)}
                        onRequestBorrow={(t) => setSelectedToolForDetail(t)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Requests & Loans Workflow View */}
        {activeTab === "requests" && (
          <BorrowRequestsView
            requests={borrowRequests}
            currentUser={currentUser}
            onUpdateStatus={handleUpdateStatus}
            onOpenReviewModal={(req) => setSelectedRequestForReview(req)}
            onSwitchToCatalog={() => setActiveTab("catalog")}
            onSwitchToLenderDashboard={() => setActiveTab("lender")}
            onOpenAuthModal={() =>
              handleOpenAuthModal(
                "Sign in to view your community requests and tool loans.",
              )
            }
          />
        )}

        {/* Dedicated Lender Hub (Lender only features) */}
        {activeTab === "lender" && (
          <LenderDashboard
            currentUser={currentUser}
            tools={tools}
            borrowRequests={borrowRequests}
            onOpenAddModal={() => setIsAddToolModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
            onToolUpdated={fetchTools}
            onSelectToolDetail={(tool) => setSelectedToolForDetail(tool)}
            onOpenAuthModal={(msg) => handleOpenAuthModal(msg)}
          />
        )}

        {/* Chat / Coordination Direct View */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl p-6 text-left space-y-4">
              <h2 className="text-xl font-bold text-[#24211d]">
                Neighborhood Coordination Messages
              </h2>
              <p className="text-xs text-[#67635c]">
                Coordinate pickup times, safe porch handovers, and tool tips
                directly with verified neighbors.
              </p>
              <div className="space-y-2">
                {allUsers
                  .filter((u) => u.id !== currentUser?.id)
                  .map((other) => (
                    <div
                      key={other.id}
                      onClick={() => {
                        setActiveChatTarget({
                          otherUserId: other.id,
                          otherUserName: other.name,
                        });
                        setIsChatModalOpen(true);
                      }}
                      className="p-3 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#ede7db] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={other.avatar}
                          alt={other.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#ded7c8]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#24211d]">
                              {other.name}
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                          </div>
                          <span className="text-[11px] text-[#67635c]">
                            {other.neighborhoodName} •{" "}
                            {other.badges?.[0] || "Neighbor"}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-[#c86d51] text-white text-xs font-bold">
                        Open Chat
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Navigation for Mobile */}
      <BottomNav
        currentUser={currentUser}
        activeTab={activeTab === "chat" ? "feedback" : activeTab}
        pendingRequestsCount={pendingRequestsCount}
        unreadMessagesCount={messages.length > 0 ? 1 : 0}
        onSelectTab={(tab) =>
          setActiveTab(tab === "feedback" ? "catalog" : tab)
        }
        onOpenAddModal={() => setIsAddToolModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAuthModal={() => handleOpenAuthModal()}
        onOpenNeighborhoodModal={() => setIsNeighborhoodModalOpen(true)}
      />

      {/* Modals */}
      <NeighborhoodModal
        isOpen={isNeighborhoodModalOpen}
        onClose={() => setIsNeighborhoodModalOpen(false)}
        neighborhoods={neighborhoods}
        currentNeighborhood={currentNeighborhood}
        currentUser={currentUser}
        onVerifyAndSwitch={handleVerifyAndSwitchNeighborhood}
      />

      <ToolDetailModal
        tool={selectedToolForDetail}
        isOpen={!!selectedToolForDetail}
        onClose={() => setSelectedToolForDetail(null)}
        currentUser={currentUser}
        onSubmitBorrow={handleBorrowSubmit}
        onOpenAuthModal={handleOpenAuthModal}
        reviews={reviews.filter((r) => r.toolId === selectedToolForDetail?.id)}
      />

      <AddToolModal
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        onAddTool={handleAddTool}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        selectedConversation={activeChatTarget}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onOpenNeighborhoodModal={() => {
          setIsProfileModalOpen(false);
          setIsNeighborhoodModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <ReviewModal
        isOpen={!!selectedRequestForReview}
        onClose={() => setSelectedRequestForReview(null)}
        request={selectedRequestForReview}
        onSubmitReview={handleReviewSubmit}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        neighborhoods={neighborhoods}
        intendedActionText={authInitialAction}
      />
    </div>
  );
}
