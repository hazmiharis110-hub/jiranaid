import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, neighborhoods, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState(
    neighborhoods?.[0]?.id || 'taman-melawati'
  );
  const [postcode, setPostcode] = useState(
    neighborhoods?.[0]?.postcode || '53100'
  );
  const [password, setPassword] = useState('');
  const [agreeTrust, setAgreeTrust] = useState(true);
  const [error, setError] = useState('');

  const handleNeighborhoodChange = (neighId: string) => {
    setSelectedNeighborhoodId(neighId);
    const found = neighborhoods.find((n) => n.id === neighId);
    if (found) {
      setPostcode(found.postcode);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+60 12-345 6789',
        neighborhoodId: selectedNeighborhoodId,
        postcode: postcode.trim() || '53100',
      });
      navigate('/items');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-[#24211d]">
          Join Your Local Circle
        </h2>
        <p className="text-xs sm:text-sm text-[#67635c]">
          Start sharing, borrowing, and saving with verified neighbors.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah Lim"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.lim@neighborhood.my"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Mobile Phone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+60 12-345 6789"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#4e4a43] mb-1">
              Residential Neighborhood *
            </label>
            <select
              value={selectedNeighborhoodId}
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            >
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4e4a43] mb-1">
              Postcode *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="53100"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4e4a43] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8a857b] absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-[#67635c] cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={agreeTrust}
            onChange={(e) => setAgreeTrust(e.target.checked)}
            required
            className="mt-0.5 rounded border-[#ded7c8] text-[#c86d51] focus:ring-[#c86d51]"
          />
          <span>
            I agree to the JiranAid Neighborhood Trust Covenant: respecting borrowed equipment, returning items on time, and upholding neighborhood goodwill.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading || !agreeTrust}
          className="w-full py-3 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isLoading ? 'Creating Resident Profile...' : 'Complete Resident Registration'}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-[#67635c]">
          Already a verified member?{' '}
          <Link to="/login" className="font-bold text-[#24211d] hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
