import React from "react";
import {User} from 'lucide-react'
import {Plus} from 'lucide-react'
import {BookCheck} from 'lucide-react'

const Card = (props) => {
    return (
        <div className="text-black">
            <div className="h-[500px] w-[300px] bg-slate-200 shadow-2xl rounded-4xl p-2">
                {/* Img Container */}
                <div className=" w-full h-full rounded-3xl overflow-hidden relative">
                    <img
                        className="w-full h-full rounded-3xl object-cover"
                        src={props.user.image}
                        alt=""
                    />
                    {/* Profile Details container */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[30%] 
                        bg-gradient-to-b from-transparent to-black/50
                            after:content-[''] after:absolute after:inset-0 after:bg-black/5rounded-b-3xl p-2"
                    >
                        {/* Top Section */}
                        <div>
                            <h1 className="font-bold text-white text-2xl mb-2">
                                {props.user.fullName}
                            </h1>
                            <p className="text-sm text-white  ">
                                {props.user.bio}
                            </p>
                        </div>
                        {/* Bottom Section */}
                        <div className="flex w-full justify-evenly items-center mt-3 text-teal-50 text-xs">
                            <div className="flex gap-3">
                                <User className="opacity-70 " size={16} />
                                <p>{props.user.followCount}</p>
                            </div>
                            <div className="flex gap-3">
                                <BookCheck className="opacity-70 " size={16} />
                                <p>{props.user.bookmarkCount}</p>
                            </div>
                            <button className="flex gap-3 bg-white text-black rounded px-2 py-1 font-bold ">
                                Follow <Plus className="opacity-70 " size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
