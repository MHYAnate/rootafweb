import { create } from 'zustand';

interface SearchStore {
  query: string;
  type: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setType: (type: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  type: 'all',
  recentSearches: [],
  setQuery: (query) => set({ query }),
  setType: (type) => set({ type }),
  addRecentSearch: (query) => {
    const recent = get().recentSearches.filter((s) => s !== query);
    set({ recentSearches: [query, ...recent].slice(0, 10) });
  },
  clearRecentSearches: () => set({ recentSearches: [] }),
}));