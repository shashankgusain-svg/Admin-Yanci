import React from "react";
import Image from "next/image";
import Search from "../../../public/icons/misc/search.svg";

export default function Searchbar({ value="", onChange = () => {}, placeHolder }) {
  return (
    <div className="searchBar h-8 flex rounded-lg border border-black-5 bg-white">
      <Image className="w-4" src={Search} alt="Search" />
      <input
        type="text"
        id="searchBar"
        name="searchBar"
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        className="text-body-1 w-full border-none outline-none active:outline-none focus:outline-none"
      />
    </div>
  );
}
