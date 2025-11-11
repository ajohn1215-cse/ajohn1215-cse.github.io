import { useState, useEffect, useMemo } from 'react';
import { Spot, SectionType } from '../../types';
import { useReservationStore } from '../../store/useReservationStore';
import { useParkingStore, calculateBestSpot } from '../../store/useParkingStore';

interface ParkingLotViewProps {
  spots: Spot[];
  sectionType: SectionType;
  sectionLabel: string;
  lotId: string;
  sectionId: string;
}

const getSectionTypeLabel = (type: SectionType): string => {
  switch (type) {
    case 'faculty': return 'Faculty';
    case 'student': return 'Student';
    case 'paid_meter': return 'Paid Meter';
    case 'visitor': return 'Visitor';
    case 'accessible': return 'Accessible';
    case 'ev': return 'EV Charging';
    default: return 'Open';
  }
};

export default function ParkingLotView({ spots, sectionType, sectionLabel, lotId, sectionId }: ParkingLotViewProps) {
  const { lots } = useParkingStore();
  const { reservations, reserveSpot, cancelReservation, getUserReservation } = useReservationStore();
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Get lot and section data
  const lot = lots.find(l => l.id === lotId);
  const section = lot?.sections?.find(s => s.id === sectionId);
  
  // Calculate best spot
  const bestSpot = useMemo(() => {
    if (!lot || !section) return null;
    return calculateBestSpot(spots, lot, section);
  }, [spots, lot, section]);
  
  // Update time remaining for selected spot
  useEffect(() => {
    if (!selectedSpot) {
      setTimeRemaining(null);
      return;
    }

    const reservation = getUserReservation(selectedSpot);
    if (!reservation) {
      setTimeRemaining(null);
      return;
    }

    const updateTime = () => {
      const remaining = Math.max(0, reservation.expiresAt - Date.now());
      setTimeRemaining(Math.floor(remaining / 1000)); // seconds
      
      if (remaining <= 0) {
        setSelectedSpot(null);
        setTimeRemaining(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [selectedSpot, getUserReservation]);

  const handleBestSpotClick = () => {
    if (!bestSpot || bestSpot.status === 'occupied') return;
    
    const userReservation = getUserReservation(bestSpot.id);
    
    if (userReservation) {
      // Cancel reservation
      cancelReservation(bestSpot.id);
      setSelectedSpot(null);
    } else if (bestSpot.status === 'open') {
      // Reserve spot
      reserveSpot({
        spotId: bestSpot.id,
        lotId,
        sectionId,
        reservedAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      setSelectedSpot(bestSpot.id);
    }
  };

  const getSpotStatus = (spot: Spot): 'open' | 'occupied' | 'reserved' | 'your-reservation' => {
    const userReservation = getUserReservation(spot.id);
    
    if (userReservation) {
      return 'your-reservation';
    }
    
    const anyReservation = reservations.find(r => r.spotId === spot.id && r.expiresAt > Date.now());
    if (anyReservation) {
      return 'reserved';
    }
    
    return spot.status;
  };

  const getTimeRemainingForSpot = (spotId: string): number | null => {
    const reservation = getUserReservation(spotId);
    if (!reservation) return null;
    
    const remaining = Math.max(0, reservation.expiresAt - Date.now());
    return Math.floor(remaining / 1000); // seconds
  };

  const availableCount = spots.filter(s => {
    const status = getSpotStatus(s);
    return status === 'open' || status === 'your-reservation';
  }).length;

  const bestSpotStatus = bestSpot ? getSpotStatus(bestSpot) : null;
  const bestSpotTimeRemaining = bestSpot ? getTimeRemainingForSpot(bestSpot.id) : null;
  const bestSpotNumber = bestSpot ? bestSpot.id.split('-').pop() : null;

  return (
    <div className="p-8 rounded-3xl border-4 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sbu-red/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sbu-navy/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-4 h-4 rounded-full ${
                  (availableCount / spots.length) > 0.5 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                  (availableCount / spots.length) > 0.2 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                  'bg-red-500 shadow-lg shadow-red-500/50'
                } animate-pulse`}></div>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-sbu-navy">{sectionLabel}</h3>
                <span className="px-4 py-2 bg-gradient-to-r from-sbu-red to-red-600 text-white rounded-xl text-sm font-bold shadow-lg">
                  {getSectionTypeLabel(sectionType)}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-700 ml-8 flex items-center gap-2">
                {sectionType === 'faculty' && <><span>👔</span> Faculty parking only</>}
                {sectionType === 'student' && <><span>🎓</span> Student parking only</>}
                {sectionType === 'paid_meter' && <><span>💰</span> Pay at meter</>}
                {sectionType === 'visitor' && <><span>🚗</span> Visitor parking</>}
                {sectionType === 'accessible' && <><span>♿</span> Accessible parking</>}
                {sectionType === 'ev' && <><span>⚡</span> EV charging available</>}
                {sectionType === 'open' && <><span>✅</span> Open parking - no restrictions</>}
              </p>
            </div>
            <div className="text-center md:text-right bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-inner border-2 border-gray-300">
              <div className="text-5xl md:text-6xl font-extrabold gradient-text mb-2">{availableCount}</div>
              <div className="text-base font-bold text-gray-700">of {spots.length} available</div>
              <div className="mt-2 text-sm text-gray-600 font-semibold">
                {Math.round((availableCount / spots.length) * 100)}% available
              </div>
            </div>
          </div>
        </div>

        {/* Best Spot Recommendation */}
        {bestSpot && bestSpotStatus !== 'occupied' ? (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 rounded-2xl p-8 border-4 border-emerald-400 shadow-2xl relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-extrabold text-emerald-900 mb-1">Recommended Spot</h4>
                    <p className="text-sm text-emerald-700 font-medium">Best available parking spot for you</p>
                  </div>
                </div>

                {/* Best Spot Display */}
                <div 
                  onClick={handleBestSpotClick}
                  className={`
                    relative bg-white rounded-xl p-6 border-4 shadow-xl
                    transition-all duration-300 cursor-pointer
                    ${bestSpotStatus === 'your-reservation' 
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 ring-4 ring-yellow-300' 
                      : 'border-emerald-500 hover:border-emerald-600 hover:shadow-2xl hover:scale-[1.02]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Spot Number */}
                      <div className={`
                        w-24 h-24 rounded-xl flex items-center justify-center
                        font-extrabold text-4xl
                        ${bestSpotStatus === 'your-reservation'
                          ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900'
                          : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                        }
                        shadow-lg
                      `}>
                        {bestSpotNumber}
                      </div>
                      
                      {/* Spot Info */}
                      <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                          {bestSpotStatus === 'your-reservation' ? 'Your Reserved Spot' : `Spot #${bestSpotNumber}`}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-semibold text-gray-600">
                          {bestSpot.accessible && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg">
                              <span>♿</span> Accessible
                            </span>
                          )}
                          {bestSpot.ev && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                              <span>⚡</span> EV Charging
                            </span>
                          )}
                          {lot?.isGarage && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg">
                              <span>🏢</span> Covered
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="text-right">
                      {bestSpotStatus === 'your-reservation' ? (
                        <div className="space-y-2">
                          <div className="px-6 py-3 bg-yellow-500 text-yellow-900 font-extrabold rounded-xl shadow-lg">
                            Reserved
                          </div>
                          {bestSpotTimeRemaining !== null && (
                            <div className="text-sm font-bold text-yellow-800">
                              {Math.floor(bestSpotTimeRemaining / 60)}:{(bestSpotTimeRemaining % 60).toString().padStart(2, '0')} remaining
                            </div>
                          )}
                        </div>
                      ) : (
                        <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg">
                          Reserve This Spot
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Why this spot is recommended */}
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">
                      <span className="text-emerald-600 font-bold">✓</span> Close to entrance
                      {bestSpot.accessible && <><span className="mx-2">•</span><span className="text-emerald-600 font-bold">✓</span> Accessible parking</>}
                      {bestSpot.ev && <><span className="mx-2">•</span><span className="text-emerald-600 font-bold">✓</span> EV charging available</>}
                      {lot?.isGarage && <><span className="mx-2">•</span><span className="text-emerald-600 font-bold">✓</span> Covered parking</>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-red-50 border-4 border-red-300 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h4 className="text-2xl font-extrabold text-red-900 mb-2">No Spots Available</h4>
            <p className="text-red-700 font-medium">This section is currently full. Please try another section or lot.</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Total Capacity</div>
              <div className="text-2xl font-extrabold text-gray-900">{spots.length}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Available Now</div>
              <div className="text-2xl font-extrabold text-emerald-600">{availableCount}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Occupied</div>
              <div className="text-2xl font-extrabold text-gray-600">{spots.length - availableCount}</div>
            </div>
          </div>
        </div>

        {/* Reservation Info */}
        {selectedSpot && timeRemaining !== null && timeRemaining > 0 && bestSpotStatus !== 'your-reservation' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-900 text-lg">🎯 Spot Reserved!</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You have <span className="font-bold">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span> to park here
                </p>
              </div>
              <button
                onClick={() => {
                  cancelReservation(selectedSpot);
                  setSelectedSpot(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
