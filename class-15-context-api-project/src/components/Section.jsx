import React from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";

const Section = () => {
    return (
        <div className="w-full px-40 py-2 flex justify-between bg-green-500">
            <Section1 />

            <Section2 />
        </div>
    );
};

export default Section;
