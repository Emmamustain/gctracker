import React from "react";
import "./Header.css";
import AddCardModal from "@/components/AddCardModal/AddCardModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import DropDownMenu from "@/components/DropDownMenu/DropDownMenu";

function Header() {
  return (
    <header className="Header">
      <div className="Logo">LOGO</div>
      <div className="hidden w-full md:block">
        <SearchBar />
      </div>
      <div className="Right">
        <AddCardModal />
        <DropDownMenu />
      </div>
    </header>
  );
}

export default Header;
