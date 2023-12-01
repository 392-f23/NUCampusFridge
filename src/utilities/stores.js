import { create } from "zustand";
import { writeToDb } from "../utilities/firebase";

const useItemsStore = create((set) => ({
    user: null,
    items : null,
    setItems: (items) => set({ items }),
    addItem: (item, user) => set((state) => {
        let items = Array.isArray(state.items) ? [...state.items] : [];
        items.push(item); 
        writeToDb(`/Data/${item.id}`, item);
        return { items };
    }),
    
    setUser: (user) => set({ user }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    business: null,
    setBusiness: (business) => set({ business }),
    favoriteDeals: [],
    setFavoriteDeals: (favoriteDeals) => set({ favoriteDeals }),
}));

export default useItemsStore;