import { Spot, SectionType } from '../../types';

interface SpotGridProps {
  spots: Spot[];
  sectionType: SectionType;
  sectionLabel: string;
}

const getSectionTypeColor = (type: SectionType): string => {
  switch (type) {
    case 'faculty':
      return 'bg-blue-50 border-blue-200';
    case 'student':
      return 'bg-green-50 border-green-200';
    case 'paid_meter':
      return 'bg-yellow-50 border-yellow-200';
    case 'visitor':
      return 'bg-purple-50 border-purple-200';
    case 'accessible':
      return 'bg-indigo-50 border-indigo-200';
    case 'ev':
      return 'bg-emerald-50 border-emerald-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const getSectionTypeLabel = (type: SectionType): string => {
  switch (type) {
    case 'faculty':
      return 'Faculty';
    case 'student':
      return 'Student';
    case 'paid_meter':
      return 'Paid Meter';
    case 'visitor':
      return 'Visitor';
    case 'accessible':
      return 'Accessible';
    case 'ev':
      return 'EV Charging';
    default:
      return 'Open';
  }
};

export default function SpotGrid({ spots, sectionType, sectionLabel }: SpotGridProps) {
  const openSpots = spots.filter(s => s.status === 'open');
  
  // Calculate grid dimensions (aim for roughly square-ish grid)
  const totalSpots = spots.length;
  const cols = Math.ceil(Math.sqrt(totalSpots * 1.5)); // Slightly wider than tall
  
  return (
    <div className={`p-6 rounded-2xl border-2 shadow-xl ${getSectionTypeColor(sectionType)} relative overflow-hidden`}>
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                (openSpots.length / totalSpots) > 0.5 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                (openSpots.length / totalSpots) > 0.2 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                'bg-red-500 shadow-lg shadow-red-500/50'
              } animate-pulse`}></div>
              <h3 className="text-2xl font-extrabold text-sbu-navy">{sectionLabel}</h3>
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-md">
                {getSectionTypeLabel(sectionType)}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {sectionType === 'faculty' && '👔 Faculty parking only'}
              {sectionType === 'student' && '🎓 Student parking only'}
              {sectionType === 'paid_meter' && '💰 Pay at meter'}
              {sectionType === 'visitor' && '🚗 Visitor parking'}
              {sectionType === 'accessible' && '♿ Accessible parking'}
              {sectionType === 'ev' && '⚡ EV charging available'}
              {sectionType === 'open' && '✅ Open parking - no restrictions'}
            </p>
          </div>
          <div className="text-right ml-6">
            <div className="text-4xl font-extrabold gradient-text mb-1">{openSpots.length}</div>
            <div className="text-sm font-semibold text-gray-600">of {totalSpots} open</div>
            <div className="mt-2 text-xs text-gray-500 font-medium">
              {Math.round((openSpots.length / totalSpots) * 100)}% available
            </div>
          </div>
        </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-emerald-600 rounded shadow-md"></div>
          <span className="text-xs font-semibold text-gray-700">Open</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-rose-500 border-2 border-red-600 rounded shadow-md opacity-75"></div>
          <span className="text-xs font-semibold text-gray-700">Occupied</span>
        </div>
        {spots.some(s => s.accessible) && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-blue-600 rounded shadow-md ring-2 ring-blue-300 ring-offset-1"></div>
            <span className="text-xs font-semibold text-gray-700">Accessible</span>
          </div>
        )}
        {spots.some(s => s.ev) && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-emerald-600 rounded shadow-md ring-2 ring-emerald-300 ring-offset-1"></div>
            <span className="text-xs font-semibold text-gray-700">EV</span>
          </div>
        )}
      </div>
      
      {/* Spot Grid */}
      <div 
        className="grid gap-2 mb-4 p-2 bg-gray-50 rounded-xl"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {spots.map((spot) => {
          const spotNumber = spot.id.split('-').pop();
          const isOpen = spot.status === 'open';
          const isAccessible = spot.accessible;
          const isEV = spot.ev;
          
          let spotClasses = '';
          if (isAccessible && isOpen) {
            spotClasses = 'spot-accessible';
          } else if (isEV && isOpen) {
            spotClasses = 'spot-ev';
          } else if (isOpen) {
            spotClasses = 'spot-open';
          } else {
            spotClasses = 'spot-occupied';
          }
          
          return (
            <div
              key={spot.id}
              className={`
                aspect-square flex items-center justify-center text-xs font-bold
                rounded-lg text-white
                ${spotClasses}
              `}
              title={`Spot ${spotNumber} - ${isOpen ? 'Open' : 'Occupied'}${isAccessible ? ' (Accessible)' : ''}${isEV ? ' (EV)' : ''}`}
            >
              <span className="drop-shadow-md">{spotNumber}</span>
            </div>
          );
        })}
      </div>
      
      {/* Available Spots List */}
      {openSpots.length > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-sbu-navy">Available Spots:</p>
            <span className="px-3 py-1 bg-green-100 rounded-full text-xs font-bold text-green-800">
              {openSpots.length} spots
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {openSpots.slice(0, 20).map((spot) => {
              const spotNumber = spot.id.split('-').pop();
              return (
                <span
                  key={spot.id}
                  className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg text-xs font-bold text-green-800 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  {spotNumber}
                  {spot.accessible && ' ♿'}
                  {spot.ev && ' ⚡'}
                </span>
              );
            })}
            {openSpots.length > 20 && (
              <span className="px-4 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200">
                +{openSpots.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

