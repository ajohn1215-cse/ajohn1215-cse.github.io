import { create } from 'zustand';
import { Reservation } from '../types';

interface ReservationStore {
  reservations: Reservation[];
  reserveSpot: (reservation: Reservation) => void;
  cancelReservation: (spotId: string) => void;
  getUserReservation: (spotId: string) => Reservation | undefined;
  clearExpiredReservations: () => void;
}

const STORAGE_KEY = 'findmyspot_reservations';
const USER_ID_KEY = 'findmyspot_user_id';

// Get or create a persistent user ID
const getUserId = (): string => {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (e) {
    // Fallback if localStorage fails
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
};

const USER_ID = getUserId();

// Load from localStorage
const loadReservations = (): Reservation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const reservations = JSON.parse(stored);
      // Filter out expired reservations
      const now = Date.now();
      return reservations.filter((r: Reservation) => r.expiresAt > now);
    }
  } catch (e) {
    console.error('Failed to load reservations:', e);
  }
  return [];
};

// Save to localStorage
const saveReservations = (reservations: Reservation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch (e) {
    console.error('Failed to save reservations:', e);
  }
};

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: loadReservations(),
  
  reserveSpot: (reservation) => {
    set((state) => {
      // Remove any existing reservation for this spot
      const filtered = state.reservations.filter(r => r.spotId !== reservation.spotId);
      const updated = [...filtered, { ...reservation, reservedBy: USER_ID }];
      saveReservations(updated);
      return { reservations: updated };
    });
  },
  
  cancelReservation: (spotId) => {
    set((state) => {
      const updated = state.reservations.filter(r => r.spotId !== spotId);
      saveReservations(updated);
      return { reservations: updated };
    });
  },
  
  getUserReservation: (spotId) => {
    const state = get();
    return state.reservations.find(
      r => r.spotId === spotId && r.reservedBy === USER_ID && r.expiresAt > Date.now()
    );
  },
  
  clearExpiredReservations: () => {
    set((state) => {
      const now = Date.now();
      const updated = state.reservations.filter(r => r.expiresAt > now);
      saveReservations(updated);
      return { reservations: updated };
    });
  },
}));

// Clear expired reservations every minute
setInterval(() => {
  useReservationStore.getState().clearExpiredReservations();
}, 60000);

