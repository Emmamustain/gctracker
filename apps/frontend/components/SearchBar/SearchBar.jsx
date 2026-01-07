"use client";

import { Search } from "lucide-react";
import React from "react";
import { useState } from "react";
import useCardStore from "@/hook/useCardsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex w-full items-center justify-center gap-2">
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm"
          onClick={() => {
            closeDropDown();
          }}
        ></div>
      ) : null}

      <div className="relative z-50 w-full max-w-[600px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            className="h-10 w-full rounded-full pl-10"
            placeholder="Search gift cards..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>
        
        {isOpen && (
          <div
            className="absolute top-12 z-50 w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
            role="search"
          >
            <div className="py-2">
              {searchResults.length > 0 ? (
                searchResults.map((searchResult) => (
                  <a
                    href={`/card/${searchResult.id}`}
                    className="block px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    role="searchCard"
                    key={searchResult.id}
                  >
                    {searchResult.name}
                  </a>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-muted-foreground">
                  No gift cards found with that name
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <Button
        onClick={() => {
          toggleDropdown();
          const results = searchCards(inputValue);
          setSearchResults(results);
        }}
        className="z-50 rounded-full"
      >
        Search
      </Button>
    </div>
  );
}

export default SearchBar;
