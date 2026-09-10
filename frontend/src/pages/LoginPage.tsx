import React, { useState } from "react";
import { data, Link, useNavigate, useSearchParams } from "react-router-dom";
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

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate and update the global Zustand auth store directly
      await login({
        email: formData.email,
        password: formData.password,
      });

      // 2. Redirect to dashboard with active session established!
      navigate("/dashboard");
      if (res && res.token) {
        localStorage.setItem("token", res.token);
      }
      if (res && res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      console.log("LOGIN RESPONSE OBJECT:", res);

      // 2. Check for success flag or user payload
      if (
        res &&
        res.success !== false &&
        (res.success || res.token || res.user)
      ) {
        // 3. Redirect to your main app screen
        navigate("/items"); // Adjust path to match your route (e.g., "/", "/dashboard")
      } else {
        setError(
          res?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      console.error("Component error during login:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-black p-7 sm:p-9 shadow-[6px_6px_0px_#000] space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Welcome Back, Neighbor
        </h2>
        <p className="text-xs sm:text-sm font-bold text-neutral-600">
          Sign in to borrow tools, manage your equipment listings, or chat.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-black text-xs font-black text-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-black text-black uppercase mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="aiman.zikri@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono font-black text-black uppercase">
              Password
            </label>
            <span className="text-[11px] font-bold text-neutral-500">
              Any password for demo
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="jn-btn w-full py-3.5 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 stroke-[2.5]" />
          <span>{loading ? "Signing In..." : "Sign In"}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs font-bold text-neutral-700">
          New to JiranAid?{" "}
          <Link
            to="/register"
            className="font-black text-black underline underline-offset-2 hover:text-[#ff90e8]"
          >
            Join your neighborhood circle
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
