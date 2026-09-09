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
  onLogin: (credentials: { email?: string; userId?: string | number }) => Promise<void>;
  onSignUp: (userData: {
    name: string;
    email: string;
    phone: string;
    neighborhoodId: string | number;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="auth-modal-sheet"
        className="w-full sm:max-w-md bg-white border-3 border-black rounded-t-3xl sm:rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b-2 border-black flex items-center justify-between bg-[#faf9f6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff90e8] text-black border-2 border-black flex items-center justify-center font-black font-mono shadow-[2px_2px_0px_#000]">
              JA
            </div>
            <div>
              <h3 className="font-black text-black text-base sm:text-lg leading-tight tracking-tight">
                {mode === "login"
                  ? "Neighbor Sign In"
                  : "Join Residential Community"}
              </h3>
              <p className="text-xs text-neutral-600 font-bold">
                Verified tool sharing for close residential circles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="jn-btn p-2 rounded-xl border-2 border-black bg-white hover:bg-[#ffc900] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Intended Action Prompt if user was triggered by borrow/lend action */}
        {intendedActionText && (
          <div className="px-5 py-2.5 bg-[#fffdf0] border-b-2 border-black text-xs text-black font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
            <span>{intendedActionText}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="p-1.5 mx-6 mt-5 bg-[#faf9f6] border-2 border-black rounded-2xl flex gap-1.5 shrink-0 shadow-[2px_2px_0px_#000]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === "login"
                ? "bg-[#ffc900] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                : "text-neutral-700 hover:text-black border-2 border-transparent"
            }`}
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === "signup"
                ? "bg-[#ffc900] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                : "text-neutral-700 hover:text-black border-2 border-transparent"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            Sign Up
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-100 border-2 border-black text-black text-xs font-bold shadow-[2px_2px_0px_#000]">
              {errorMessage}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              {/* Standard Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. farhan@resident.my"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-black text-black uppercase">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="jn-btn w-full py-3 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{loading ? "Signing in..." : "Sign In as Neighbor"}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farhan Ramli"
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farhan@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
                <span className="text-[11px] text-neutral-600 font-medium mt-1 block">
                  Encrypted & kept private. In-app chat is used for all handover coordination.
                </span>
              </div>

              {/* Neighborhood Pool Selection */}
              <div>
                <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                  Immediate Residential Community
                </label>
                <select
                  value={selectedNeighborhoodId}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                >
                  {(neighborhoods || []).map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.postcode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                  Residential Postcode
                </label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. 53100"
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#bbf7d0] border-2 border-black flex items-start gap-2.5 text-xs text-black font-medium shadow-[2.5px_2.5px_0px_#000]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-black stroke-[2.5]" />
                <span>
                  New accounts receive a starting{" "}
                  <strong>5.0 Community Trust Score</strong> and full access to
                  borrow and share within your 1.5km geofenced radius.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="jn-btn w-full py-3 rounded-xl bg-[#ff90e8] hover:bg-[#ff7ae2] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {loading
                    ? "Creating account..."
                    : "Complete Resident Registration"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
