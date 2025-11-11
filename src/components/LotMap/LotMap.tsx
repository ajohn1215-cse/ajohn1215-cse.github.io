import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';
import { Lot } from '../../types';
import 'leaflet/dist/leaflet.css';

interface LotMapProps {
  lots: Lot[];
}

export default function LotMap({ lots }: LotMapProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Fix for default marker icons in react-leaflet
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[40.9145, -73.1234]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lots.map((lot) => (
          <Marker
            key={lot.id}
            position={[lot.location.lat, lot.location.lng]}
            eventHandlers={{
              click: () => navigate(`/lots/${lot.id}`),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-sbu-navy mb-2">{lot.name}</h3>
                <p className="text-sm mb-2">
                  <span className="font-semibold text-sbu-red">
                    {lot.available} / {lot.capacity}
                  </span>{' '}
                  available
                </p>
                <button
                  onClick={() => navigate(`/lots/${lot.id}`)}
                  className="text-sm text-sbu-red hover:underline"
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

