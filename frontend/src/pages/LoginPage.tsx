import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/authService";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Send login credentials
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE OBJECT:", res);

      // 2. Check for success flag or user payload
      if (
        res &&
        res.success !== false &&
        (res.success || res.token || res.user)
      ) {
        // 3. Redirect to your main app screen
        navigate("/dashboard"); // Adjust path to match your route (e.g., "/", "/dashboard")
      } else {
        setError(
          res?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      console.error("Component error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-[#24211d]">
          Welcome Back, Neighbor
        </h2>
        <p className="text-xs sm:text-sm text-[#67635c]">
          Sign in to borrow tools, manage your equipment listings, or chat.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="aiman.zikri@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#4e4a43]">
              Password
            </label>
            <span className="text-[11px] text-[#8a857b]">
              Any password for demo
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#24211d] hover:bg-black text-[#faf8f5] text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? "Signing In..." : "Sign In"}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-[#67635c]">
          New to JiranAid?{" "}
          <Link
            to="/register"
            className="font-bold text-[#c86d51] hover:underline"
          >
            Join your neighborhood circle
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
