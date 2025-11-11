import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useParkingStore } from '../../store/useParkingStore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import ParkingLotView from '../ParkingLotView/ParkingLotView';
import 'leaflet/dist/leaflet.css';

export default function LotDetail() {
  const { id } = useParams<{ id: string }>();
  const { lots, simulateRefresh } = useParkingStore();

  useEffect(() => {
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const lot = lots.find((l) => l.id === id);

  if (!lot) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sbu-navy mb-4">Lot not found</h1>
          <Link to="/lots" className="text-sbu-red hover:underline">
            ← Back to lots
          </Link>
        </div>
      </main>
    );
  }

  const percentage = Math.round((lot.available / lot.capacity) * 100);
  const status = percentage === 0 ? 'Full' : percentage < 20 ? 'Limited' : 'Open';
  const statusClass =
    percentage === 0 ? 'status-closed' : percentage < 20 ? 'status-limited' : 'status-open';

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lot.location.lat},${lot.location.lng}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/lots"
        className="text-sbu-red hover:underline mb-6 inline-block"
      >
        ← Back to all lots
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-4 h-4 rounded-full ${
                    percentage > 50 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                    percentage > 20 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                    'bg-red-500 shadow-lg shadow-red-500/50'
                  } animate-pulse`}></div>
                  <h1 className="text-5xl font-display font-extrabold text-sbu-navy">
                    {lot.name}
                  </h1>
                </div>
                <p className="text-lg font-semibold text-gray-600">Code: <span className="text-sbu-gray font-bold">{lot.code}</span></p>
              </div>
              <span className={`status-badge ${statusClass} text-lg px-6 py-3 shadow-xl`}>
                {status}
              </span>
            </div>
          </div>

          {/* Availability Card */}
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-sbu-navy">Availability</h2>
              <div className={`w-4 h-4 rounded-full ${
                percentage > 50 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                percentage > 20 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                'bg-red-500 shadow-lg shadow-red-500/50'
              } animate-pulse`}></div>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-7xl font-extrabold gradient-text">{lot.available}</div>
                <div className="text-3xl text-gray-400 font-medium">of {lot.capacity}</div>
                <div className="text-xl text-gray-600 font-semibold ml-auto">spots available</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner mb-3">
                <div
                  className={`h-5 rounded-full transition-all duration-700 ${
                    percentage > 50 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                      : percentage > 20 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30' 
                      : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-600">
                  {percentage}% capacity
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Last updated just now</span>
                </div>
              </div>
            </div>

            {/* Sections with Individual Spots */}
            {lot.sections && lot.sections.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-3xl font-extrabold text-sbu-navy mb-6">Select Your Parking Spot</h3>
                <p className="text-gray-600 mb-6 font-medium">
                  Click on an open spot to reserve it for 15 minutes. Your reserved spot will be highlighted in yellow.
                </p>
                <div className="space-y-8">
                  {lot.sections.map((section) => (
                    <div key={section.id}>
                      <ParkingLotView
                        spots={section.spots || []}
                        sectionType={section.type}
                        sectionLabel={section.label}
                        lotId={lot.id}
                        sectionId={section.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy Zones Support */}
            {lot.zones && lot.zones.length > 0 && !lot.sections && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Zones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lot.zones.map((zone) => {
                    const zonePercentage = Math.round((zone.available / zone.capacity) * 100);
                    return (
                      <div key={zone.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{zone.label}</span>
                          <span className="text-sm text-gray-600">
                            {zone.available} / {zone.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              zonePercentage > 50
                                ? 'bg-green-500'
                                : zonePercentage > 20
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${zonePercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Demo Refresh Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={simulateRefresh}
                className="btn-secondary w-full"
              >
                🔄 Simulate Refresh (Demo)
              </button>
            </div>
          </div>

          {/* Details Card */}
          <div className="card">
            <h2 className="text-2xl font-bold text-sbu-navy mb-4">Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-gray-600">Type</dt>
                <dd className="text-lg">{lot.type === 'garage' ? 'Garage' : 'Parking Lot'}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Enforcement Hours</dt>
                <dd className="text-lg">
                  {lot.enforcementHours === '24/7' && (
                    <span className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold">
                        24/7 Restricted
                      </span>
                      {lot.is247Restricted && 'Enforced at all times'}
                    </span>
                  )}
                  {lot.enforcementHours === 'evening_weekend' && (
                    <span className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">
                        Evening/Weekend
                      </span>
                      Available 4pm-7am Mon-Fri, All day Sat-Sun
                    </span>
                  )}
                  {lot.enforcementHours === 'daytime' && (
                    <span className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                        Daytime
                      </span>
                      Enforced Mon-Fri 7am-4pm
                    </span>
                  )}
                  {lot.enforcementHours === 'business_hours' && (
                    <span className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">
                        Business Hours
                      </span>
                    </span>
                  )}
                  {lot.enforcementHours === 'none' && (
                    <span className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-semibold">
                        No Enforcement
                      </span>
                      Public parking
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Parking Type</dt>
                <dd className="flex flex-wrap gap-2 mt-2">
                  {lot.isGarage && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      🏢 Paid Garage
                    </span>
                  )}
                  {lot.isMetered && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      💰 Metered Parking
                    </span>
                  )}
                  {!lot.isGarage && !lot.isMetered && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                      🅿️ Permit Required
                    </span>
                  )}
                  {lot.fallSessionAllowed && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      🍂 Fall Session
                    </span>
                  )}
                </dd>
              </div>
              {lot.notes && (
                <div>
                  <dt className="text-sm font-semibold text-gray-600">Notes</dt>
                  <dd className="text-lg">{lot.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-3">Amenities</dt>
                <dd className="flex flex-wrap gap-3 mt-2">
                  {lot.amenities.ev && (
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold shadow-sm">
                      ⚡ EV Charging
                    </span>
                  )}
                  {lot.amenities.accessible && (
                    <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-300 text-indigo-800 rounded-xl text-sm font-bold shadow-sm">
                      ♿ Accessible
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-3">Tags</dt>
                <dd className="flex flex-wrap gap-2 mt-2">
                  {lot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold shadow-sm capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map */}
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📍</span>
              </div>
              <h2 className="text-2xl font-extrabold text-sbu-navy">Location</h2>
            </div>
            <div className="h-64 w-full rounded-2xl overflow-hidden mb-6 shadow-lg border-2 border-gray-200">
              <MapContainer
                center={[lot.location.lat, lot.location.lng]}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lot.location.lat, lot.location.lng]}>
                  <Popup>{lot.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block"
            >
              📍 Get Directions →
            </a>
          </div>

          {/* Quick Actions */}
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sbu-red to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <h2 className="text-2xl font-extrabold text-sbu-navy">Quick Actions</h2>
            </div>
            <div className="space-y-4">
              <Link to="/lots" className="btn-secondary w-full text-center block group">
                <span className="flex items-center justify-center gap-2">
                  Browse All Lots
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <a
                href="https://www.stonybrook.edu/mobility-and-parking/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center block group"
              >
                <span className="flex items-center justify-center gap-2">
                  Visit MAPS Website
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

