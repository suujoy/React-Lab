import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Section2 = () => {
    const [theme,setTheme] = useContext(ThemeDataContext);

    return <div>{theme}</div>;
};

export default Section2;
