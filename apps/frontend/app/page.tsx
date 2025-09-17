import Categories from "@/components/Categories/Categories.jsx";
import SearchBar from "@/components/SearchBar/SearchBar.jsx";

import Cards from "@/components/Cards/Cards.jsx";

function Home() {
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
