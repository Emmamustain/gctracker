"use client";

import { Search } from "lucide-react";
import React from "react";
import { useState } from "react";
import useCardStore from "@/hook/useCardsStore";

function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const { searchCards } = useCardStore();
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropDown = () => {
    setIsOpen(false);
  };

  return (
    <div className="mt-5 flex w-full items-center justify-center">
      {isOpen ? (
        <div
          className="absolute inset-0 bg-black/10"
          onClick={() => {
            closeDropDown();
          }}
        ></div>
      ) : null}

      <div className="relative mr-1 w-full max-w-[600px]">
        <input
          type="text"
          className="h-10 w-full rounded-3xl border-1 border-gray-400 pl-10"
          placeholder="Search ..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <Search className="absolute bottom-2 left-2" color="gray" />
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-11 z-10 w-full max-w-[570px] rounded-md bg-white shadow-lg`}
          role="search"
        >
          {/* ... Dropdown items ... */}
          <div className="py-1" role="none ">
            {searchResults.length > 0 ? (
              searchResults.map((searchResult) => (
                <a
                  href={`/card/${searchResult.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="searchCard"
                  key={searchResult.id}
                >
                  {searchResult.name}
                </a>
              ))
            ) : (
              <p className="pl-6 text-sm text-gray-700">
                There is no card with this name or brand{" "}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          toggleDropdown();
          const results = searchCards(inputValue);
          setSearchResults(results);
          console.log(searchCards(inputValue));
        }}
        className="z-10 h-10 w-fit rounded-3xl border-1 border-blue-700 bg-blue-600 px-3 text-amber-50 hover:cursor-pointer hover:border-blue-500 hover:bg-blue-500"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
