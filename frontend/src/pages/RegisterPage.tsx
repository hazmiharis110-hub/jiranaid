import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/authService";
import { neighborService } from "../services/neighborService";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { neighborhoods: storeNeighborhoods, isLoading: isStoreLoading } =
    useAuthStore();

  // Local state for dropdown options
  const [neighborhoodsList, setNeighborhoodsList] = useState<any[]>([]);
  const [fetchingNeighs, setFetchingNeighs] = useState(false);

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhoodId: "",
    postcode: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTrust, setAgreeTrust] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch Neighborhoods (Tries Store first, falls back to API directly)
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      // If store already has data, use it
      if (storeNeighborhoods && storeNeighborhoods.length > 0) {
        setNeighborhoodsList(storeNeighborhoods);
        return;
      }

      // Otherwise fetch directly from API endpoint
      try {
        setFetchingNeighs(true);
        const res = await neighborService.getNeighbors();

        // Safely extract array whether response is [ ... ] or { data: [ ... ] } or { neighborhoods: [ ... ] }
        const payload = Array.isArray(res) ? res : res?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.neighborhoods || payload?.data || [];

        setNeighborhoodsList(list);
      } catch (err) {
        console.error("Failed to load neighborhoods from database:", err);
      } finally {
        setFetchingNeighs(false);
      }
    };

    fetchNeighborhoods();
  }, [storeNeighborhoods]);

  // 2. Automatically select the first neighborhood & default postcode once data arrives
  useEffect(() => {
    if (neighborhoodsList.length > 0 && !formData.neighborhoodId) {
      const first = neighborhoodsList[0];
      const firstId = String(
        first.id || first._id || first.neighborhood_id || "",
      );
      const firstPostcode = first.postcode || first.postal_code || "";

      setFormData((prev) => ({
        ...prev,
        neighborhoodId: firstId,
        postcode: firstPostcode,
      }));
    }
  }, [neighborhoodsList]);

  // Standard input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dropdown change handler - updates selected neighborhood and matches its default postcode
  const handleNeighborhoodChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = e.target.value;
    const found = neighborhoodsList.find((n) => {
      const id = String(n.id || n._id || n.neighborhood_id || "");
      return id === selectedId;
    });

    setFormData((prev) => ({
      ...prev,
      neighborhoodId: selectedId,
      postcode: found
        ? found.postcode || found.postal_code || prev.postcode
        : prev.postcode,
    }));
  };

  // Submit Handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const targetNeighborhoodId =
        formData.neighborhoodId || (formData as any).neighborhood_id;

      await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        neighborhoodId: targetNeighborhoodId,
        neighborhood_id: targetNeighborhoodId,
        postcode: formData.postcode,
        password: formData.password,
      });

      setSuccessMessage(
        "Account created successfully! Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || isStoreLoading;

  return (
    <div className="bg-white rounded-3xl border-3 border-black p-7 sm:p-9 shadow-[6px_6px_0px_#000] space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Join Your Local Circle
        </h2>
        <p className="text-xs sm:text-sm font-bold text-neutral-600">
          Start sharing, borrowing, and saving with verified neighbors.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-black text-xs font-black text-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-black text-black uppercase mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sarah Lim"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-black text-black uppercase mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah.lim@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-black text-black uppercase mb-1">
            Mobile Phone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+60 12-345 6789"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Neighborhood *
            </label>
            <div className="relative">
              <select
                name="neighborhoodId"
                value={formData.neighborhoodId}
                onChange={handleNeighborhoodChange}
                required
                disabled={fetchingNeighs}
                className="w-full px-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51] disabled:opacity-50 appearance-none"
              >
                {fetchingNeighs ? (
                  <option value="" disabled>
                    Loading neighborhoods...
                  </option>
                ) : neighborhoodsList.length === 0 ? (
                  <option value="" disabled>
                    No neighborhoods found
                  </option>
                ) : (
                  neighborhoodsList.map((n) => {
                    const id = String(n.id || n._id || n.neighborhood_id || "");
                    const name =
                      n.name || n.neighborhood_name || "Unknown Neighborhood";
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })
                )}
              </select>
              {fetchingNeighs && (
                <Loader2 className="w-4 h-4 text-[#8a857b] animate-spin absolute right-3 top-3 pointer-events-none" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Postcode *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                placeholder="53100"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-neutral-800 font-medium cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={agreeTrust}
            onChange={(e) => setAgreeTrust(e.target.checked)}
            required
            className="mt-0.5 rounded-md border-2 border-black text-black w-4 h-4 accent-black focus:ring-0 cursor-pointer"
          />
          <span>
            I agree to the JiranAid Neighborhood Trust Covenant: respecting
            borrowed equipment, returning items on time, and upholding
            neighborhood goodwill.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !agreeTrust}
          className="jn-btn w-full py-3.5 rounded-xl bg-[#ff90e8] hover:bg-[#ff7ae2] text-black text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>
            {isSubmitting
              ? "Creating Resident Profile..."
              : "Complete Resident Registration"}
          </span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs font-bold text-neutral-700">
          Already a verified member?{" "}
          <Link
            to="/login"
            className="font-black text-black underline underline-offset-2 hover:text-[#ff90e8]"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
