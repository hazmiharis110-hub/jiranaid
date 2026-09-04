import React, { useState } from "react";
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { User, Neighborhood } from "../types.ts";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  neighborhoods?: Neighborhood[];
  onLogin: (credentials: { email?: string; userId?: string }) => Promise<void>;
  onSignUp: (userData: {
    name: string;
    email: string;
    phone: string;
    neighborhoodId: string;
    postcode: string;
  }) => Promise<void>;
  intendedActionText?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  neighborhoods = [],
  onLogin,
  onSignUp,
  intendedActionText,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState(
    neighborhoods?.[0]?.id || "taman-melawati",
  );
  const [postcode, setPostcode] = useState(
    neighborhoods?.[0]?.postcode || "53100",
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (
      neighborhoods &&
      neighborhoods.length > 0 &&
      (!selectedNeighborhoodId || selectedNeighborhoodId === "taman-melawati")
    ) {
      setSelectedNeighborhoodId(neighborhoods[0].id);
      setPostcode(neighborhoods[0].postcode);
    }
  }, [neighborhoods]);

  const handleNeighborhoodChange = (neighId: string) => {
    setSelectedNeighborhoodId(neighId);
    const n = (neighborhoods || []).find((item) => item.id === neighId);
    if (n) setPostcode(n.postcode);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await onLogin({ email: email.trim() });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await onSignUp({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "+60 12-345 6789",
        neighborhoodId: selectedNeighborhoodId,
        postcode: postcode.trim() || "53100",
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="auth-modal-sheet"
        className="w-full sm:max-w-md bg-[#fcfbf9] border-t sm:border border-[#ded7c8] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#c86d51] text-white flex items-center justify-center font-bold">
              JA
            </div>
            <div>
              <h3 className="font-bold text-[#24211d] text-sm sm:text-base leading-tight">
                {mode === "login"
                  ? "Neighbor Sign In"
                  : "Join Residential Community"}
              </h3>
              <p className="text-[11px] text-[#67635c]">
                Verified tool sharing for close residential circles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-xl text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intended Action Prompt if user was triggered by borrow/lend action */}
        {intendedActionText && (
          <div className="px-5 py-2.5 bg-[#fbeee9] border-b border-[#c86d51]/20 text-xs text-[#b0553b] font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{intendedActionText}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="p-1.5 mx-5 mt-4 bg-[#ede7db] rounded-xl flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
            }}
            className={`flex-1 min-h-10 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-[#fcfbf9] text-[#24211d] shadow-xs"
                : "text-[#67635c] hover:text-[#24211d]"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage("");
            }}
            className={`flex-1 min-h-10 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              mode === "signup"
                ? "bg-[#fcfbf9] text-[#24211d] shadow-xs"
                : "text-[#67635c] hover:text-[#24211d]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              {/* Standard Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8c867b] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. farhan@resident.my"
                      className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#4e4a43]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8c867b] absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full min-h-11 py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? "Signing in..." : "Sign In as Neighbor"}
                </button>
              </form>
            </div>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farhan Ramli"
                  className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farhan@gmail.com"
                  className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
                <span className="text-[10px] text-[#67635c] mt-0.5 block">
                  Encrypted & kept private. In-app chat is used for all handover
                  coordination.
                </span>
              </div>

              {/* Neighborhood Pool Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Immediate Residential Community
                </label>
                <select
                  value={selectedNeighborhoodId}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] font-medium focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                >
                  {(neighborhoods || []).map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.postcode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Residential Postcode
                </label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. 53100"
                  className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#eef4f0] border border-[#5f7d66]/30 flex items-start gap-2 text-[11px] text-[#496350]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#5f7d66]" />
                <span>
                  New accounts receive a starting{" "}
                  <strong>5.0 Community Trust Score</strong> and full access to
                  borrow and share within your 1.5km geofenced radius.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full min-h-11 py-2.5 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                {loading
                  ? "Creating account..."
                  : "Complete Resident Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
