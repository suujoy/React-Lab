import React from "react";

const TaskList = () => {
    return (
        <div
            id="taskList"
            className="h-[55%] overflow-x-auto w-full  mt-10 py-4 flex items-center justify-start gap-5 flex-nowrap"
        >
            <div className="h-full p-3 bg-emerald-700 rounded-xl shrink-0 w-[300px]">
                <div className="flex justify-between items-center p-2">
                    <h3 className="text-sm bg-red-600 px-3 font-bold rounded-xl">
                        High
                    </h3>
                    <h4 className="font-extrabold text-sm">12-01-2026</h4>
                </div>
                <h2 className="mt-10 font-bold text-2xl">
                    Make a Youtube Video
                </h2>
                <p className="text-sm mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sequi aliquid non quia, odit dolore nesciunt!
                </p>
            </div>
        </div>
    );
};

export default TaskList;
