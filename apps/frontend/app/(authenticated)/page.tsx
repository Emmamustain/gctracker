"use client";
import Categories from "@/components/Categories/Categories";
import SearchBar from "@/components/SearchBar/SearchBar.jsx";

import Cards from "@/components/Cards/Cards.jsx";
import { TGiftspace } from "@shared/types";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const { user } = useUserStore();
  const router = useRouter();
  async function getGiftspaces(): Promise<TGiftspace[]> {
    if (!user) return [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${user?.id}`,
    );
    return response.json();
  }

  const { data: giftspaces } = useQuery({
    queryKey: ["getGiftspaces"],
    queryFn: getGiftspaces,
  });

  const primaryGiftspace = giftspaces?.[0];
  useEffect(() => {
    if (primaryGiftspace) {
      router.push(`/giftspace/${primaryGiftspace.id}`);
    }
  }, [primaryGiftspace]);
  return (
    <>
      <div className="p-3">
        <div className="block md:hidden">
          <SearchBar />
        </div>
        <Categories />

        {/* <FavoriteCards />
        <DiscoverCards /> */}
        <Cards favoritesOnly={true} />
        <Cards favoritesOnly={false} />
      </div>
    </>
  );
}

export default Home;
