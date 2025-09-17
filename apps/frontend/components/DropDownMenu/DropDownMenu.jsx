"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useState } from "react";

function DropDownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative inline-block text-left">
      <Menu
        size={30}
        color="black"
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleDropdown(); // Trigger toggle on Enter/Space
          }
        }}
        role="button"
      />

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg`}
        role="menu"
      >
        {/* ... Dropdown items ... */}
        <div className="py-1" role="none">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-1"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  );
}

export default DropDownMenu;
