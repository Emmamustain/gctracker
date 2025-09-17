import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCardStore = create(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (brand, name, code, pin, balance, image) => {
        const id = crypto.randomUUID();
        const date = new Date();
        const newCard = {
          id,
          name,
          brand,
          code,
          pin,
          balance,
          image,
          createdAt: date,
          favorite: false,
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
      },

      updateBalance: (id, balance) =>
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === id) {
              card.balance = balance;
            }
            return card;
          }),
        })),

      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        })),

      getCardById: (id) => get().cards.find((card) => card.id === id),

      searchCards: (query) =>
        get().cards.filter(
          (card) =>
            card.name.toLowerCase().includes(query.toLowerCase()) ||
            card.brand.toLowerCase().includes(query.toLowerCase())
        ),

      updateName: (id, newName) =>
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === id) {
              card.name = newName;
            }
            return card;
          }),
        })),

      updateFavorite: (id) =>
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === id) {
              card.favorite = !card.favorite;
            }
            return card;
          }),
        })),
    }),

    {
      name: "cards",
    }
  )
);

export default useCardStore;
