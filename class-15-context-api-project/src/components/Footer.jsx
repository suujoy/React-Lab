import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Footer = () => {
    const [theme,setTheme] = useContext(ThemeDataContext);

    return (
        <div className="w-full px-9 py-2 flex justify-evenly bg-yellow-500 absolute bottom-0">
            <h1>Footer</h1>
            {theme}
        </div>
    );
};

export default Footer;
