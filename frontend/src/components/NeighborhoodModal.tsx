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
    String(currentNeighborhood?.id ?? (neighborhoods?.[0]?.id ?? ''))
  );
  const [postcodeInput, setPostcodeInput] = useState<string>(currentUser?.postcode || '53100');
  const [isVerifyingGps, setIsVerifyingGps] = useState<boolean>(false);
  const [gpsVerifiedSuccess, setGpsVerifiedSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activePool = (neighborhoods || []).find((n) => String(n.id) === String(selectedId)) || neighborhoods?.[0];

  const handleSimulateGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      setIsVerifyingGps(false);
      setGpsVerifiedSuccess(true);
      // Auto-select nearest matching pool
      if (neighborhoods && neighborhoods.length > 0) {
        setSelectedId(String(neighborhoods[0].id));
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="neighborhood-modal-content"
        className="w-full max-w-lg bg-white border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-black flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#bbf7d0] border-2 border-black text-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base sm:text-lg leading-tight tracking-tight">
                Neighborhood Verification & Pool
              </h3>
              <p className="text-xs text-neutral-600 font-bold">
                Location binding keeps borrowing hyper-local and safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="jn-btn p-2 rounded-xl border-2 border-black bg-white hover:bg-[#ffc900] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Verification Status Banner */}
          <div className="p-4 rounded-2xl border-2 border-black bg-[#bbf7d0] flex items-start gap-3 shadow-[3px_3px_0px_#000]">
            <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[2.5]" />
            <div className="text-xs space-y-1">
              <div className="font-black text-black text-sm">
                Verified Resident Status Active
              </div>
              <p className="text-neutral-800 font-medium leading-relaxed">
                You are currently accessing tools within your verified 1.5 km residential zone.
                Borrowing is restricted to neighbors to maintain accountability and trust.
              </p>
            </div>
          </div>

          {/* Quick GPS Geofence Check */}
          <div className="border-2 border-black rounded-2xl p-4 sm:p-5 bg-[#fffdf0] space-y-3 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-black stroke-[2.5]" />
                <span className="text-sm font-black text-black">Instant GPS Geofence Check</span>
              </div>
              {gpsVerifiedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-black bg-[#bbf7d0] border border-black px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Geofence Locked
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-700 font-medium">
              Check your coordinates to automatically lock into your residential quadrant.
            </p>
            <button
              id="verify-gps-btn"
              type="button"
              onClick={handleSimulateGps}
              disabled={isVerifyingGps}
              className="jn-btn w-full py-2.5 px-4 rounded-xl border-2 border-black bg-[#ff90e8] hover:bg-[#ff7ae2] text-black text-xs font-black transition-all flex items-center justify-center gap-2 shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 cursor-pointer"
            >
              {isVerifyingGps ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Detecting Neighborhood Coordinates...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 stroke-[2.5]" />
                  <span>{gpsVerifiedSuccess ? 'Re-Verify Current GPS Position' : 'Verify Current Neighborhood via GPS'}</span>
                </>
              )}
            </button>
          </div>

          {/* Select or Switch Community Pool */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-black uppercase tracking-wider">
                Select Residential Community Pool
              </label>
              <span className="text-xs font-bold text-neutral-600">{filteredPools.length} Pools Available</span>
            </div>

            {/* Search filter for pools */}
            <div className="relative">
              <Search className="w-4 h-4 text-black absolute left-3.5 top-3 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search neighborhood or postcode..."
                className="w-full pl-10 pr-3 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredPools.map((pool) => {
                const isSelected = String(selectedId) === String(pool.id);
                return (
                  <div
                    key={pool.id}
                    onClick={() => {
                      setSelectedId(String(pool.id));
                      setPostcodeInput(pool.postcode);
                    }}
                    className={`p-3 sm:p-3.5 rounded-xl border-2 border-black cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#ffc900] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white hover:bg-[#faf9f6] shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black">{pool.name}</span>
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-black bg-white text-black">
                          {pool.postcode}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-700 font-medium">{pool.city}</span>
                    </div>

                    <div className="text-right text-[11px] font-bold text-neutral-800 shrink-0">
                      <div className="font-black font-mono text-black">{pool.activeTools} tools</div>
                      <div>{pool.activeMembers} neighbors</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Community Pool Quick Stats */}
          {activePool && (
            <div className="grid grid-cols-3 gap-2 p-3 sm:p-4 rounded-2xl bg-[#faf9f6] border-2 border-black text-center shadow-[3px_3px_0px_#000]">
              <div className="p-1">
                <div className="flex items-center justify-center gap-1 text-black mb-1">
                  <Users className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-base font-black font-mono text-black">{activePool.activeMembers}</div>
                <div className="text-[10px] font-bold text-neutral-600">Neighbors</div>
              </div>
              <div className="p-1 border-x-2 border-black">
                <div className="flex items-center justify-center gap-1 text-black mb-1">
                  <Wrench className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-base font-black font-mono text-black">{activePool.activeTools}</div>
                <div className="text-[10px] font-bold text-neutral-600">Active Tools</div>
              </div>
              <div className="p-1">
                <div className="flex items-center justify-center gap-1 text-black mb-1">
                  <DollarSign className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-base font-black font-mono text-black">RM {(activePool.estimatedMoneySaved ?? 0).toLocaleString()}</div>
                <div className="text-[10px] font-bold text-neutral-600">Saved Locally</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-black bg-[#faf9f6] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="jn-btn px-4 py-2.5 rounded-xl border-2 border-black bg-white text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-neighborhood-btn"
            type="button"
            onClick={handleSave}
            className="jn-btn px-5 py-2.5 rounded-xl border-2 border-black bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs font-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Bind & Enter This Community Pool
          </button>
        </div>
      </div>
    </div>
  );
};
