import React from "react";
import MainCard from "./MainCard";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Arrow from "../../components/Arrow";
import HomeIMG from "../../components/HomeIMG";

const Home = (props) => {
    return (
        <div className="bg-slate-800 max-w-[1700px] m-auto h-fit py-4 px-3 grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="hidden xl:block xl:col-span-1">
                <HomeIMG />
            </div>

            <div className="xl:col-span-2 flex flex-col gap-3">
                <MainCard val={props.val} />
                <Arrow next={props.next} prev={props.prev} />
            </div>
        </div>
    );
};

export default Home;
