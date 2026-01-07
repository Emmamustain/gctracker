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

  const getCards = async (): Promise<TGiftcard[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/giftspace/${params["giftspace_id"]}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }
    const data: TGiftcard[] = await response.json();
    return data;
  };

  const getBrands = async (): Promise<TBrand[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/brands`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    const data: TBrand[] = await response.json();
    return data;
  };

  const { data: brands } = useQuery({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  }) as { data: TBrand[] | undefined };

  // Queries - Force the type explicitly to fix inference issues
  const { data: cards } = useQuery({
    queryKey: ["getGiftcards", giftspaceId],
    queryFn: getCards,
    enabled: Boolean(giftspaceId),
  }) as { data: TGiftcard[] | undefined };
  console.log({ cards });

  const hasCards =
    cards && cards.some((card) => card.favorite === favoritesOnly);

  if (!hasCards) return;

  return (
    <div className="w-full space-y-4">
      <h2 className="syne text-xl font-semibold tracking-tight">
        {favoritesOnly ? "Favorites" : "All GiftCards"}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
