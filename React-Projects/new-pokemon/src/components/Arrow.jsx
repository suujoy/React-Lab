import React from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const Arrow = (props) => {
    return (
        <div
            className="bg-[radial-gradient(circle_at_top_right,#fde68a,transparent_45%),radial-gradient(circle_at_bottom_left,#fb7185,transparent_50%),linear-gradient(135deg,#020617,#f59e0b,#ef4444,#facc15,#020617)]
flex justify-evenly items-center p-2 rounded sticky bottom-0 md:static"
        >
            {/* Prev */}
            <div
                className="flex items-center gap-4 px-4 py-2 rounded-full
  bg-[linear-gradient(225deg,#fef3c7,#facc15,#fde047)] shadow-md"
            >
                <div
                    onClick={props.page > 1 ? props.prev : undefined}
                    className={`p-3 rounded-full
      bg-[radial-gradient(circle_at_top_right,#fde68a,transparent_45%),linear-gradient(225deg,#020617,#f59e0b,#facc15)]
      backdrop-blur-xl shadow-lg transition
      ${
          props.page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 active:scale-95"
      }`}
                >
                    <ArrowBigLeft color="white" size={18} />
                </div>
            </div>

            {/* Page */}
            <p className="font-bold text-slate-900 bg-white/80 px-4 py-1 rounded-full shadow">
                Page {props.page}
            </p>

            {/* Next */}
            <div
                className="flex items-center gap-4 px-4 py-2 rounded-full
  bg-[linear-gradient(135deg,#fef3c7,#facc15,#fde047)] shadow-md"
            >
                <div
                    onClick={props.next}
                    className="p-3 rounded-full
      bg-[radial-gradient(circle_at_top_left,#fde68a,transparent_45%),linear-gradient(135deg,#020617,#f59e0b,#facc15)]
      backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95 transition"
                >
                    <ArrowBigRight color="white" size={18} />
                </div>
            </div>
        </div>
    );
};

export default Arrow;
