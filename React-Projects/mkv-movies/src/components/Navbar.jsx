import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="w-full px-4 py-2 flex justify-between bg-slate-600 items-center text-white font-bold">
            <h2
                draggable
                className="text-pink-700 cursor-grab text-2xl capitalize"
            >
                MKV Cinemas
            </h2>
            <div className="text-pink-400 flex w-2/3 justify-evenly items-center">
                <NavLink to="/"> Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/movie">Movie</NavLink>
                <NavLink to="/favorite">Favorite</NavLink>
            </div>
        </div>
    );
};

export default Navbar;
