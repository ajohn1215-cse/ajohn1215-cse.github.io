import { create } from 'zustand';
import lotsData from '../data/lots.json';
import { Lot, Section, Spot } from '../types';

// Helper function to generate spots for a section
function generateSpotsForSection(section: Section, useFakeCapacity: boolean = false): Spot[] {
  const spots: Spot[] = [];
  const effectiveCapacity = useFakeCapacity && section.fakeCapacityForDemo ? section.fakeCapacityForDemo : section.capacity;
  const occupied = effectiveCapacity - section.available;
  
  // Determine special spot counts
  const accessibleCount = section.type === 'accessible' ? Math.min(10, effectiveCapacity) : 0;
  const evCount = section.type === 'ev' ? effectiveCapacity : 0;
  
  // Randomly assign occupied spots
  const occupiedIndices = new Set<number>();
  
  // Randomly select indices for occupied spots
  while (occupiedIndices.size < occupied && occupiedIndices.size < effectiveCapacity) {
    const idx = Math.floor(Math.random() * effectiveCapacity);
    if (!occupiedIndices.has(idx)) {
      occupiedIndices.add(idx);
    }
  }
  
  // Generate spots
  for (let i = 0; i < effectiveCapacity; i++) {
    const spotNumber = i + 1;
    const spotId = `${section.id}-${spotNumber.toString().padStart(3, '0')}`;
    const isOccupied = occupiedIndices.has(i);
    const isAccessible = i < accessibleCount || section.type === 'accessible';
    const isEV = section.type === 'ev' || (evCount > 0 && i >= accessibleCount && i < accessibleCount + evCount);
    
    spots.push({
      id: spotId,
      sectionId: section.id,
      status: isOccupied ? 'occupied' : 'open',
      accessible: isAccessible ? true : undefined,
      ev: isEV ? true : undefined,
    });
  }
  
  return spots;
}

// Calculate best spot based on various factors
export function calculateBestSpot(spots: Spot[], lot: Lot, section: Section): Spot | null {
  const openSpots = spots.filter(s => s.status === 'open');
  if (openSpots.length === 0) return null;
  
  // Score each spot based on:
  // 1. Proximity to entrance (lower spot numbers = closer, higher score)
  // 2. Accessibility (bonus points)
  // 3. EV charging (bonus points)
  // 4. Not being near occupied spots (isolation bonus)
  
  const scoredSpots = openSpots.map(spot => {
    const spotNumber = parseInt(spot.id.split('-').pop() || '0');
    let score = 1000 - spotNumber; // Lower numbers = higher score (closer to entrance)
    
    // Accessibility bonus
    if (spot.accessible) score += 200;
    
    // EV charging bonus
    if (spot.ev) score += 150;
    
    // Isolation bonus - prefer spots with fewer occupied neighbors
    const spotIndex = spots.findIndex(s => s.id === spot.id);
    let occupiedNeighbors = 0;
    if (spotIndex > 0 && spots[spotIndex - 1]?.status === 'occupied') occupiedNeighbors++;
    if (spotIndex < spots.length - 1 && spots[spotIndex + 1]?.status === 'occupied') occupiedNeighbors++;
    score += (2 - occupiedNeighbors) * 50; // More isolation = higher score
    
    // Garage bonus (covered parking)
    if (lot.isGarage) score += 100;
    
    return { spot, score };
  });
  
  // Sort by score (highest first) and return the best one
  scoredSpots.sort((a, b) => b.score - a.score);
  return scoredSpots[0]?.spot || null;
}

// Helper to vary availability slightly (within 5% of original)
function varyAvailability(original: number, capacity: number): number {
  const variation = Math.floor(Math.random() * (capacity * 0.05 * 2)) - (capacity * 0.05);
  const newAvailable = original + variation;
  return Math.max(0, Math.min(capacity, Math.floor(newAvailable)));
}

// Initialize lots with generated spots
function initializeLots(): Lot[] {
  return (lotsData as Lot[]).map((lot) => {
    // Ensure all required fields have defaults
    const lotWithDefaults: Lot = {
      ...lot,
      enforcementHours: lot.enforcementHours || 'evening_weekend',
      is247Restricted: lot.is247Restricted ?? false,
      isMetered: lot.isMetered ?? false,
      isGarage: lot.isGarage ?? (lot.type === 'garage'),
      fallSessionAllowed: lot.fallSessionAllowed ?? false,
    };

    if (lotWithDefaults.sections) {
      const sectionsWithSpots = lotWithDefaults.sections.map((section) => {
        // Use fakeCapacityForDemo if available, otherwise use capacity
        const effectiveCapacity = section.fakeCapacityForDemo || section.capacity;
        
        // Vary availability slightly on each load
        const variedAvailable = varyAvailability(section.available, effectiveCapacity);
        
        return {
          ...section,
          available: variedAvailable,
          spots: generateSpotsForSection({ ...section, capacity: effectiveCapacity, available: variedAvailable }, true),
        };
      });
      
      // Recalculate total available from sections
      const totalAvailable = sectionsWithSpots.reduce((sum, s) => sum + s.available, 0);
      
      return {
        ...lotWithDefaults,
        available: totalAvailable,
        sections: sectionsWithSpots,
      };
    } else {
      // For lots without sections, vary availability
      const effectiveCapacity = lotWithDefaults.fakeCapacityForDemo || lotWithDefaults.capacity;
      const variedAvailable = varyAvailability(lotWithDefaults.available, effectiveCapacity);
      
      return {
        ...lotWithDefaults,
        available: variedAvailable,
      };
    }
  });
}

interface ParkingStore {
  lots: Lot[];
  selectedLot: Lot | null;
  setSelectedLot: (lot: Lot | null) => void;
  simulateRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    visitor: boolean;
    commuter: boolean;
    garage: boolean;
    ev: boolean;
    accessible: boolean;
    faculty: boolean;
  };
  setFilter: (key: keyof ParkingStore['filters'], value: boolean) => void;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
}

export const useParkingStore = create<ParkingStore>((set) => ({
  lots: initializeLots(),
  selectedLot: null,
  setSelectedLot: (lot) => set({ selectedLot: lot }),
  simulateRefresh: () => {
    set((state) => ({
      lots: state.lots.map((lot) => {
        if (lot.sections) {
          const updatedSections = lot.sections.map((section) => {
            // Use fakeCapacityForDemo if available
            const effectiveCapacity = section.fakeCapacityForDemo || section.capacity;
            
            // Vary availability slightly (within 5% of capacity)
            const variedAvailable = varyAvailability(section.available, effectiveCapacity);
            
            // Regenerate spots with new availability
            const updatedSection = { ...section, available: variedAvailable };
            const spots = generateSpotsForSection({ ...updatedSection, capacity: effectiveCapacity }, true);
            
            return {
              ...updatedSection,
              spots,
            };
          });
          
          // Recalculate total available
          const totalAvailable = updatedSections.reduce((sum, s) => sum + s.available, 0);
          
          return {
            ...lot,
            sections: updatedSections,
            available: totalAvailable,
          };
        } else {
          // Legacy zones support
          const effectiveCapacity = lot.fakeCapacityForDemo || lot.capacity;
          const variedAvailable = varyAvailability(lot.available, effectiveCapacity);
          return {
            ...lot,
            available: variedAvailable,
            zones: lot.zones?.map((zone) => {
              const zoneVaried = varyAvailability(zone.available, zone.capacity);
              return {
                ...zone,
                available: zoneVaried,
              };
            }),
          };
        }
      }),
    }));
  },
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filters: {
    visitor: false,
    commuter: false,
    garage: false,
    ev: false,
    accessible: false,
    faculty: false,
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

