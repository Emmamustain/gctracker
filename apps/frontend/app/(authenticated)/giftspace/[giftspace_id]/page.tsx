"use client";
import Categories from "@/components/Categories/Categories";
import SearchBar from "@/components/SearchBar/SearchBar.jsx";

import Cards from "@/components/Cards/Cards";

function Giftspace() {
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

export default Giftspace;
