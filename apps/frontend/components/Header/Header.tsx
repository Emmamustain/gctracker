"use client";

import React from "react";
import AddCardModal from "@/components/AddCardModal/AddCardModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import { ProfileDropdown } from "@/components/ProfileDropdown/ProfileDropdown";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center space-x-2">
            <span className="syne text-xl font-bold tracking-tight">GC.TRACKER</span>
          </a>
          <div className="hidden w-96 md:block">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <AddCardModal />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header;
