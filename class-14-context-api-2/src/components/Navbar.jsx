import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const Navbar = (props) => {
    const data = useContext(UserDataContext);
    console.log(data)
    return (
        <div className="bg-emerald-800 text-white font-bold w-full h-10">
            <h1>Navbar</h1>
        </div>
    );
};

export default Navbar;
