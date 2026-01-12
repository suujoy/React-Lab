import React from "react";

const TaskListNumber = () => {
    return (
        <div className="flex mt-4 screen justify-between gap-5">
            <div className="rounded-xl w-[45%] px-9 py-6 bg-red-600">
                <h2 className="text-2xl font-semibold">0</h2>
                <h3 className="text-xl font-medium">New Task</h3>
            </div>
            <div className="rounded-xl w-[45%] px-9 py-6 bg-blue-600">
                <h2 className="text-2xl font-semibold">0</h2>
                <h3 className="text-xl font-medium">New Task</h3>
            </div>
            <div className="rounded-xl w-[45%] px-9 py-6 bg-green-600">
                <h2 className="text-2xl font-semibold">0</h2>
                <h3 className="text-xl font-medium">New Task</h3>
            </div>
            <div className="rounded-xl w-[45%] px-9 py-6 bg-yellow-500">
                <h2 className="text-2xl font-semibold">0</h2>
                <h3 className="text-xl font-medium">New Task</h3>
            </div>
        </div>
    );
};

export default TaskListNumber;
