import React, { useState } from "react";
import Card from "./components/Card";

const App = () => {
    const formHandler = (event) => {
        event.preventDefault();
    };

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [mobile, setMobile] = useState("");
    const [photo, setPhoto] = useState("");
    const [bio, setBio] = useState("");

    const [allUsers, setAllUsers] = useState([]);

    const buttonFunctionality = (event) => {
        setAllUsers((prev) => [...prev, { name, age, mobile, photo, bio }]);
        setName("");
        setAge("");
        setMobile("");
        setPhoto("");
        setBio("");
    };

    const deleteHandler=(index)=>{
        const copyUser=[...allUsers]
        copyUser.splice(index,1)
        setAllUsers(copyUser)
    }

    return (
        <div className="bg-slate-900 flex h-screen w-full flex-col gap-5   md:flex-row  ">
            <form
                onSubmit={(event) => {
                    formHandler(event);
                }}
                className=" bg-sky-100 m-2 rounded-2xl p-4 h-fit w-full md:w-[50%] lg:w-[30%] xl:w-[30%] 2xl:w-[25%] flex-col flex   justify-center items-center gap-7 "
            >
                <input
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Your  Name "
                    className="bg-purple-200 text-black outline-none w-full placeholder:font-bold font-light placeholder:text-red-900  px-4 py-1  rounded-sm "
                />
                <input
                    value={age}
                    onChange={(event) => {
                        setAge(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Your age "
                    className="bg-purple-200 text-black outline-none w-full placeholder:font-bold font-light placeholder:text-red-900  px-4 py-1  rounded-sm "
                />
                <input
                    value={mobile}
                    onChange={(event) => {
                        setMobile(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Your Mobile Number "
                    className="bg-purple-200 text-black outline-none w-full placeholder:font-bold font-light placeholder:text-red-900  px-4 py-1  rounded-sm "
                />
                <input
                    value={photo}
                    onChange={(event) => {
                        setPhoto(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Your Profile Photo"
                    className="bg-purple-200 text-black outline-none w-full placeholder:font-bold font-light placeholder:text-red-900  px-4 py-1  rounded-sm "
                />
                <input
                    value={bio}
                    onChange={(event) => {
                        setBio(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Your Bio"
                    className="bg-purple-200 text-black outline-none w-full placeholder:font-bold font-light placeholder:text-red-900  px-4 py-1  rounded-sm "
                />
                <button
                    onClick={(event) => {
                        buttonFunctionality();
                    }}
                    className="bg-green-800 text-white text-xl font-bold rounded-xl px-5 py-1 "
                >
                    Click Here
                </button>
            </form>
            <div
                id="card-container"
                className="h-screen rounded-2xl  w-full overflow-y-auto flex flex-wrap"
            >
                {allUsers.map((user, index) => {
                    return (
                        <Card
                            key={index}
                            index={index}
                            photo={user.photo}
                            name={user.name}
                            age={user.age}
                            bio={user.bio}
                            mobile={user.mobile}
                            deleteHandler={deleteHandler}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default App;
