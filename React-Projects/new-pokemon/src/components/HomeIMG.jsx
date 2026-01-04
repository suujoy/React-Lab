import React from "react";
import allCharecter from "../assets/all-charecters.webp";
import pokemonName from "../assets/Pokemon-Logo-.webp";
const HomeIMG = () => {
    return (
        <div className="p-9  h-full rounded  bg-[linear-gradient(180deg,#fff7ed,#fde68a,#fef3c7)] flex flex-col justify-evenly "> 
            <div className="">
                <img src={pokemonName} alt="" />
            </div>
            <div className="">
                <img src={allCharecter} alt="" />
            </div>
        </div>
    );
};

export default HomeIMG;
