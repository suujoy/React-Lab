import React from "react";

const Card = (props) => {
    return (
        <div className="bg-yellow-50 h-fit flex-col gap-5 w-[250px] p-5 rounded-2xl flex">
            <img
                className="w-[100px] h-[100px] rounded-full object-top object-cover border-2  "
                src={props.image}
                alt=""
            />
            <h1 className="font-extrabold text-2xl bg-yellow-100 px-8 py-2 rounded-2xl  ">
                {props.name}
            </h1>
            <h2 className="font-bold p-8 py-2 text-xl  text-violet-900 ">
                {props.roll}
            </h2>
            <p className="font-light p-8 py-2 bg-amber-100 rounded-2xl text-sm ">
                {props.bio}
            </p>
            <button 
                onClick={()=>{
                    props.deleteHandel(props.index)
                }}
             className="bg-orange-600 px-6 py-1 rounded-2xl active:scale-95 w-fit  font-extrabold text-white">Remove</button>
        </div>
    );
};

export default Card;
