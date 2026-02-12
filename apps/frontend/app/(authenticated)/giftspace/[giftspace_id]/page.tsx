"use client";
import Categories from "@/components/Categories/Categories";
import SearchBar from "@/components/SearchBar/SearchBar.jsx";
import Cards from "@/components/Cards/Cards";

function Giftspace() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8 sm:px-8">
      <div className="block md:hidden">
        <SearchBar />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="syne text-2xl font-bold tracking-tight">Categories</h2>
        </div>
        <Categories />
      </section>

      <div className="grid gap-8">
        <Cards favoritesOnly={true} />
        <Cards />
        <Cards discardedOnly={true} />
      </div>
    </div>
  );
}

export default Giftspace;
