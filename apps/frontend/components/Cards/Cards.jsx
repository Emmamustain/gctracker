"use client";
import Card from "../Card/Card";

import useCardsStore from "@/hook/useCardsStore";

function Cards({ favoritesOnly }) {
  const { cards } = useCardsStore();
  return (
    <div className="mt-[45px] w-full">
      <h1 className="pl-2 text-lg font-semibold text-gray-600">
        {favoritesOnly ? "Favorites" : "All GiftCards"}
      </h1>
      <div className="mt-2 flex w-full flex-wrap items-center gap-4 rounded-2xl border-1 border-gray-200 bg-gray-100 p-4">
        {cards
          .filter((card) => card.favorite === favoritesOnly)
          .map((card) => (
            <Card
              key={card.id}
              logo={card.image}
              id={card.id}
              favorite={card.favorite}
            />
          ))}
      </div>
    </div>
  );
}

export default Cards;
