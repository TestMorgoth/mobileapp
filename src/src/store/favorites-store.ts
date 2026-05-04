import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  poiIds: string[];
  eventIds: string[];
  itineraryIds: string[];
  togglePoi: (id: string) => void;
  toggleEvent: (id: string) => void;
  toggleItinerary: (id: string) => void;
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      poiIds: [],
      eventIds: [],
      itineraryIds: [],
      togglePoi: (id) => set((state) => ({ poiIds: toggle(state.poiIds, id) })),
      toggleEvent: (id) => set((state) => ({ eventIds: toggle(state.eventIds, id) })),
      toggleItinerary: (id) => set((state) => ({ itineraryIds: toggle(state.itineraryIds, id) })),
    }),
    {
      name: 'favorites-store',
      partialize: (state) => ({
        poiIds: state.poiIds,
        eventIds: state.eventIds,
        itineraryIds: state.itineraryIds,
      }),
    },
  ),
);
