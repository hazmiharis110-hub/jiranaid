import React, { useState } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Users,
  Wrench,
  DollarSign,
  Search,
} from 'lucide-react';
import type { Neighborhood, User } from '../types.ts';

interface NeighborhoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhoods?: Neighborhood[];
  currentNeighborhood: Neighborhood | null;
  currentUser: User | null;
  onVerifyAndSwitch: (neighborhoodId: string, postcode: string, method: 'gps' | 'postcode') => void;
}

export const NeighborhoodModal: React.FC<NeighborhoodModalProps> = ({
  isOpen,
  onClose,
  neighborhoods = [],
  currentNeighborhood,
  currentUser,
  onVerifyAndSwitch,
}) => {
  if (!isOpen) return null;

  const [selectedId, setSelectedId] = useState<string>(
    currentNeighborhood?.id || (neighborhoods?.[0]?.id ?? '')
  );
  const [postcodeInput, setPostcodeInput] = useState<string>(currentUser?.postcode || '53100');
  const [isVerifyingGps, setIsVerifyingGps] = useState<boolean>(false);
  const [gpsVerifiedSuccess, setGpsVerifiedSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activePool = (neighborhoods || []).find((n) => n.id === selectedId) || neighborhoods?.[0];

  const handleSimulateGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      setIsVerifyingGps(false);
      setGpsVerifiedSuccess(true);
      // Auto-select nearest matching pool
      if (neighborhoods && neighborhoods.length > 0) {
        setSelectedId(neighborhoods[0].id);
        setPostcodeInput(neighborhoods[0].postcode);
      }
    }, 900);
  };

  const handleSave = () => {
    onVerifyAndSwitch(
      selectedId,
      postcodeInput,
      gpsVerifiedSuccess ? 'gps' : 'postcode'
    );
    onClose();
  };

  const filteredPools = neighborhoods.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.postcode.includes(searchQuery) ||
      n.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="neighborhood-modal-content"
        className="w-full max-w-lg bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5f7d66] text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#24211d] text-base leading-tight">
                Neighborhood Verification & Pool
              </h3>
              <p className="text-xs text-[#67635c]">
                Location binding keeps borrowing hyper-local and safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Verification Status Banner */}
          <div className="p-4 rounded-xl border border-[#5f7d66]/30 bg-[#eef4f0] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-[#496350]">
                Verified Resident Status Active
              </div>
              <p className="text-[#5b6e60] leading-relaxed">
                You are currently accessing tools within your verified 1.5 km residential zone.
                Borrowing is restricted to neighbors to maintain accountability and trust.
              </p>
            </div>
          </div>

          {/* Quick GPS Geofence Check */}
          <div className="border border-[#ded7c8] rounded-xl p-4 bg-[#faf8f5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#c86d51]" />
                <span className="text-sm font-bold text-[#24211d]">Instant GPS Geofence Check</span>
              </div>
              {gpsVerifiedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5f7d66]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Geofence Locked
                </span>
              )}
            </div>
            <p className="text-xs text-[#67635c]">
              Check your coordinates to automatically lock into your residential quadrant.
            </p>
            <button
              id="verify-gps-btn"
              type="button"
              onClick={handleSimulateGps}
              disabled={isVerifyingGps}
              className="w-full py-2.5 px-4 rounded-lg border border-[#c86d51] text-[#c86d51] hover:bg-[#c86d51]/10 text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isVerifyingGps ? (
                <>
                  <span className="w-3 h-3 border-2 border-[#c86d51] border-t-transparent rounded-full animate-spin"></span>
                  Detecting Neighborhood Coordinates...
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  {gpsVerifiedSuccess ? 'Re-Verify Current GPS Position' : 'Verify Current Neighborhood via GPS'}
                </>
              )}
            </button>
          </div>

          {/* Select or Switch Community Pool */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#24211d] uppercase tracking-wider">
                Select Residential Community Pool
              </label>
              <span className="text-[11px] text-[#67635c]">{filteredPools.length} Pools Available</span>
            </div>

            {/* Search filter for pools */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c867b] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search neighborhood or postcode..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#fcfbf9] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredPools.map((pool) => {
                const isSelected = selectedId === pool.id;
                return (
                  <div
                    key={pool.id}
                    onClick={() => {
                      setSelectedId(pool.id);
                      setPostcodeInput(pool.postcode);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#c86d51] bg-[#fbeee9]'
                        : 'border-[#ded7c8] bg-[#fcfbf9] hover:bg-[#f5f0e6]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#24211d]">{pool.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e8e2d7] text-[#4e4a43]">
                          {pool.postcode}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#67635c]">{pool.city}</span>
                    </div>

                    <div className="text-right text-[11px] text-[#67635c] shrink-0">
                      <div className="font-semibold text-[#5f7d66]">{pool.activeTools} tools</div>
                      <div>{pool.activeMembers} neighbors</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Community Pool Quick Stats */}
          {activePool && (
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#f4efe6] border border-[#ded7c8] text-center">
              <div className="p-2">
                <div className="flex items-center justify-center gap-1 text-[#5f7d66] mb-1">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-[#24211d]">{activePool.activeMembers}</div>
                <div className="text-[10px] text-[#67635c]">Verified Neighbors</div>
              </div>
              <div className="p-2 border-x border-[#ded7c8]">
                <div className="flex items-center justify-center gap-1 text-[#c86d51] mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-[#24211d]">{activePool.activeTools}</div>
                <div className="text-[10px] text-[#67635c]">Active Tools</div>
              </div>
              <div className="p-2">
                <div className="flex items-center justify-center gap-1 text-[#5f7d66] mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-[#24211d]">RM {activePool.estimatedMoneySaved.toLocaleString()}</div>
                <div className="text-[10px] text-[#67635c]">Saved Locally</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e8e2d7] bg-[#f4efe6] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-neighborhood-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Bind & Enter This Community Pool
          </button>
        </div>
      </div>
    </div>
  );
};
