"use client";
import { TBrand, TGiftcard } from "@shared/types";
import Card from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface CardProps {
  favoritesOnly?: boolean;
  discardedOnly?: boolean;
}

function Cards({ favoritesOnly = false, discardedOnly = false }: CardProps) {
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

  let filteredCards = cards || [];
  let title = "All GiftCards";

  if (favoritesOnly) {
    filteredCards = cards?.filter((card) => card.favorite === true) || [];
    title = "Favorites";
  } else if (discardedOnly) {
    filteredCards = cards?.filter((card) => card.discarded === true) || [];
    title = "Discarded Cards";
  } else {
    filteredCards = cards?.filter((card) => card.discarded !== true) || [];
    title = "Active GiftCards";
  }

  if (!filteredCards.length) return null;

  return (
    <div className="w-full space-y-4">
      <h2 className="syne text-xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            logo={brands?.find((v) => v.id === card.brand)?.imageUrl ?? ""}
            id={card.id}
            favorite={card.favorite}
            discarded={card.discarded}
          />
        ))}
      </div>
    </div>
  );
}

export default Cards;
