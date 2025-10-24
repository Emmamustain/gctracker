"use client";
import { TBrand, TGiftcard } from "@shared/types";
import Card from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface CardProps {
  favoritesOnly: boolean;
}

function Cards({ favoritesOnly }: CardProps) {
  const params = useParams();
  const giftspaceId = params["giftspace_id"];

  async function getCards(): Promise<TGiftcard[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/giftspace/${params["giftspace_id"]}`,
    );
    return response.json();
  }

  async function getBrands(): Promise<TBrand[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/brands`,
    );
    return response.json();
  }
  const { data: brands } = useQuery({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  });

  // Queries
  const { data: cards } = useQuery({
    queryKey: ["getGiftcards"],
    queryFn: getCards,
    enabled: Boolean(giftspaceId),
  });
  console.log({ cards });

  const hasCards =
    cards && cards.some((card) => card.favorite === favoritesOnly);

  if (!hasCards) return;

  return (
    <div className="mt-[45px] w-full">
      <h1 className="pl-2 text-lg font-semibold text-gray-600">
        {favoritesOnly ? "Favorites" : "All GiftCards"}
      </h1>
      <div className="mt-2 flex w-full flex-wrap items-center gap-4 rounded-2xl border-1 border-gray-200 bg-gray-100 p-4">
        {cards
          ? cards
              .filter((card) => card.favorite === favoritesOnly)
              .map((card) => (
                <Card
                  key={card.id}
                  logo={
                    brands?.find((v) => v.id === card.brand)?.imageUrl ?? ""
                  }
                  id={card.id}
                  favorite={card.favorite}
                />
              ))
          : null}
      </div>
    </div>
  );
}

export default Cards;
