import React from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
    return (
        <div className="bg-pink-600 px-7 py-3 text-white gap-5 items-center capitalize flex w-full justify-between">
            <SearchIcon size={30} />
            <input
                className="border-2 w-[300px] outline-none rounded-full px-5 py-1"
                type="text"
                placeholder="Search movie"
            />

            <div className=" w-full font-bold text-xl hidden md:block ">
                Search by name
            </div>
        </div>
    );
};

export default Search;
