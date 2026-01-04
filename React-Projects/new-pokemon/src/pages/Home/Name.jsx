import React from "react";

const Name = (props) => {
    return (
        <div className="w-full m-auto capitalize flex flex-col gap-4">
            <h2 className="m-auto w-fit font-extrabold text-3xl text-white">
                {props.name}
            </h2>

            <div className="font-extrabold text-xl w-full flex justify-evenly">
                {props.type.map((val, index) => (
                    <p
                        key={index}
                        className="px-4 py-1 rounded-full bg-white/15 backdrop-blur text-white"
                    >
                        {val}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Name;
