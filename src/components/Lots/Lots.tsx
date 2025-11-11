import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useParkingStore } from '../../store/useParkingStore';
import { Lot } from '../../types';
import LotMap from '../LotMap/LotMap';

export default function Lots() {
  const { lots, searchQuery, setSearchQuery, filters, setFilter, viewMode, setViewMode } = useParkingStore();
  const [searchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'commuter') {
      setFilter('commuter', true);
    } else if (filterParam === 'visitor') {
      setFilter('visitor', true);
    } else if (filterParam === 'faculty') {
      setFilter('faculty', true);
    }
  }, [searchParams, setFilter]);

  useEffect(() => {
    setSearchQuery(localSearch);
  }, [localSearch, setSearchQuery]);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      // Search filter
      const matchesSearch =
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filters
      const matchesVisitor = !filters.visitor || lot.tags.includes('visitor');
      const matchesCommuter = !filters.commuter || lot.tags.includes('commuter');
      const matchesGarage = !filters.garage || lot.type === 'garage';
      const matchesEV = !filters.ev || lot.amenities.ev;
      const matchesAccessible = !filters.accessible || lot.amenities.accessible;
      
      // Faculty filter - check if lot has faculty sections
      const hasFacultySection = lot.sections?.some(section => section.type === 'faculty') || false;
      const matchesFaculty = !filters.faculty || hasFacultySection;

      return (
        matchesSearch &&
        matchesVisitor &&
        matchesCommuter &&
        matchesGarage &&
        matchesEV &&
        matchesAccessible &&
        matchesFaculty
      );
    });
  }, [lots, searchQuery, filters]);

  const getStatusBadge = (lot: Lot) => {
    const percentage = (lot.available / lot.capacity) * 100;
    if (percentage === 0) return { label: 'Full', class: 'status-closed' };
    if (percentage < 20) return { label: 'Limited', class: 'status-limited' };
    return { label: 'Open', class: 'status-open' };
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-sbu-red to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🅿️</span>
          </div>
          <div>
            <h1 className="text-5xl font-display font-extrabold text-sbu-navy mb-2">
              Browse Parking Lots
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Find available parking across Stony Brook University campus
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search lots by name, code, or tag..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-sbu-red/20 focus:border-sbu-red outline-none transition-all shadow-sm hover:shadow-md bg-white font-medium"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-md'
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-md'
              }`}
            >
              🗺️ Map
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('visitor', !filters.visitor)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.visitor
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            🚗 Visitor
          </button>
          <button
            onClick={() => setFilter('commuter', !filters.commuter)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.commuter
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            🎓 Commuter
          </button>
          <button
            onClick={() => setFilter('garage', !filters.garage)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.garage
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            🏢 Garage
          </button>
          <button
            onClick={() => setFilter('ev', !filters.ev)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.ev
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            ⚡ EV Charging
          </button>
          <button
            onClick={() => setFilter('accessible', !filters.accessible)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.accessible
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            ♿ Accessible
          </button>
          <button
            onClick={() => setFilter('faculty', !filters.faculty)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
              filters.faculty
                ? 'bg-gradient-to-r from-sbu-red to-red-700 text-white shadow-red-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-sbu-red hover:shadow-lg'
            }`}
          >
            👔 Faculty
          </button>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'map' ? (
        <LotMap lots={filteredLots} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No lots found matching your criteria.</p>
            </div>
          ) : (
            filteredLots.map((lot) => {
              const status = getStatusBadge(lot);
              const percentage = Math.round((lot.available / lot.capacity) * 100);

              return (
                <Link
                  key={lot.id}
                  to={`/lots/${lot.id}`}
                  className="group relative card-elevated hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sbu-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            percentage > 50 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                            percentage > 20 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                            'bg-red-500 shadow-lg shadow-red-500/50'
                          } animate-pulse`}></div>
                          <h3 className="text-2xl font-extrabold text-sbu-navy group-hover:text-sbu-red transition-colors">{lot.name}</h3>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Code: <span className="font-bold text-sbu-gray">{lot.code}</span></p>
                      </div>
                      <span className={`status-badge ${status.class} shadow-lg`}>{status.label}</span>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available</span>
                        <div className="text-right">
                          <span className="text-3xl font-extrabold gradient-text">
                            {lot.available}
                          </span>
                          <span className="text-lg text-gray-400 font-medium"> / {lot.capacity}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            percentage > 50 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                              : percentage > 20 
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30' 
                              : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">{percentage}% capacity</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
                        {lot.type === 'garage' ? '🏢 Garage' : '🅿️ Lot'}
                      </span>
                      {lot.sections?.some(s => s.type === 'faculty') && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 shadow-sm">
                          👔 Faculty
                        </span>
                      )}
                      {lot.sections?.some(s => s.type === 'student') && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg text-xs font-semibold text-green-800 shadow-sm">
                          🎓 Student
                        </span>
                      )}
                      {lot.amenities.ev && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 shadow-sm">
                          ⚡ EV
                        </span>
                      )}
                      {lot.amenities.accessible && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-800 shadow-sm">
                          ♿ Accessible
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">{lot.hours}</p>
                        <span className="text-sbu-red font-bold group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {filteredLots.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredLots.length} of {lots.length} lots
        </div>
      )}
    </main>
  );
}

