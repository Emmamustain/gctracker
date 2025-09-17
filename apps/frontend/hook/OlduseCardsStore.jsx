import { useState } from "react";
import { getItem, setItem } from "@/utils/LocalStorage";

export default function useCardsStore() {
  const [cards, setCards] = useState(getCards());
  function getCards() {
    return getItem("cards") ?? [];
  }

  function addCard(name, brand, code, pin, balance, image) {
    const id = crypto.randomUUID();
    const date = new Date();
    const card = {
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
    const newCards = [...cards, card];
    setCards(newCards);
    setItem("cards", newCards);
  }

  function updateBalance(id, balance) {
    const newCards = cards.map((card) => {
      if (card.id === id) {
        card.balance = balance;
      }
      return card;
    });
    setCards(newCards);
    setItem("cards", newCards);
  }

  function deleteCard(id) {
    const newCards = cards.filter((card) => card.id !== id);
    setCards(newCards);
    setItem("cards", newCards);
  }

  function updateFavorite(id) {
    const newCards = cards.map((card) => {
      if (card.id === id) {
        card.favorite = !card.favorite;
      }
      return card;
    });
    setCards(newCards);
    setItem("cards", newCards);
  }

  return { cards, addCard, updateBalance, deleteCard, updateFavorite };
}
