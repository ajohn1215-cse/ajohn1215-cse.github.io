export type SectionType = 'faculty' | 'student' | 'paid_meter' | 'open' | 'visitor' | 'accessible' | 'ev';

export interface Reservation {
  spotId: string;
  lotId: string;
  sectionId: string;
  reservedAt: number; // timestamp
  expiresAt: number; // timestamp (15 minutes from reservedAt)
  reservedBy?: string; // user identifier
}

export interface Spot {
  id: string;
  sectionId: string;
  status: 'open' | 'occupied' | 'reserved';
  accessible?: boolean;
  ev?: boolean;
}

export interface Section {
  id: string;
  label: string;
  type: SectionType;
  capacity: number;
  fakeCapacityForDemo?: number;
  available: number;
  spots: Spot[];
}

export interface Lot {
  id: string;
  name: string;
  code: string;
  type: 'lot' | 'garage';
  capacity: number;
  fakeCapacityForDemo?: number;
  available: number;
  tags: string[];
  amenities: {
    ev: boolean;
    accessible: boolean;
  };
  hours: string;
  enforcementHours: '24/7' | 'evening_weekend' | 'business_hours' | 'daytime' | 'none';
  is247Restricted?: boolean;
  isMetered?: boolean;
  isGarage?: boolean;
  fallSessionAllowed?: boolean;
  notes?: string;
  location: {
    lat: number;
    lng: number;
  };
  sections?: Section[];
  // Legacy zones support (for backward compatibility)
  zones?: Array<{
    id: string;
    label: string;
    capacity: number;
    available: number;
  }>;
}

