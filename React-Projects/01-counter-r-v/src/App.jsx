import React, { useState } from "react";

const App = () => {
    const [num, setNum] = useState(0);
    const increaseNum = () => {
        if(num<100){
            setNum(num + 1)
        }
    };
    const decreaseNum = () => {
        if(num>0){
            setNum(num-1)
        }
    };
    return (
        <div className="w-full h-screen flex justify-center items-center bg-slate-800">
            <div className="border-2 border-white rounded-2xl w-[300px] h-[400px] bg-pink-300 p-5 flex flex-col justify-center items-center gap-6  ">
                <h1 className="w-[200px] h-[150px] bg-yellow-300 flex justify-center items-center text-8xl font-extrabold rounded text-pink-600   ">
                    {num}
                </h1>
                <button
                    onClick={increaseNum}
                    className="bg-emerald-500 active:scale-95 text-5xl px-5 py-1 rounded-2xl font-bold text-white border-2  "
                >
                    Increase
                </button>
                <button
                    onClick={decreaseNum}
                    className="bg-orange-500 active:scale-95 text-5xl px-5 py-1 rounded-2xl font-bold text-white border-2  "
                >
                    Decrease
                </button>
            </div>
        </div>
    );
};

export default App;
