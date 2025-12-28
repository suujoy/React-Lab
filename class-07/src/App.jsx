import React, { useState } from "react";
import Card from "./components/Card";

const App = () => {
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const [userBio, setUserBio] = useState("");
    const [userRoll, setUserRoll] = useState("");

    const [allUsers, setAllUsers] = useState([]);

    const submitHandler = (event) => {
        event.preventDefault();

        const oldUser = [...allUsers];
        oldUser.push({ image, userBio, userName, userRoll });
        
        setAllUsers(oldUser);
        setUserBio("");
        setImage("");
        setUserRoll("");
        setUserName("");
    };

    const deleteHandel =(index)=>{
        const copyUser = [...allUsers]
        copyUser.splice(index,1)
        setAllUsers(copyUser)
        console.log('Sujoy')
    }

    return (
        <div className=" bg-slate-800 h-fit flex flex-wrap gap-4 w-full p-7">
            <form
                onSubmit={(event) => {
                    submitHandler(event);
                }}
                className="bg-emerald-900 w-full   h-fit p-8 flex flex-wrap gap-6 m-auto rounded "
            >
                <input
                    onChange={(event) => {
                        setUserName(event.target.value);
                    }}
                    value={userName}
                    className="bg-emerald-100  px-8 py-1 w-[100%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded  border-2 border-sky-400  "
                    type="text"
                    placeholder="Enter Your Name"
                />

                <input
                    onChange={(event) => {
                        setImage(event.target.value);
                    }}
                    value={image}
                    className="bg-emerald-100  px-8 py-1 w-[100%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded  border-2 border-sky-400  "
                    type="text"
                    placeholder="Image Url"
                />

                <input
                    onChange={(event) => {
                        setUserRoll(event.target.value);
                    }}
                    value={userRoll}
                    className="bg-emerald-100  px-8 py-1 w-[100%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded  border-2 border-sky-400  "
                    type="text"
                    placeholder="Enter Your Roll"
                />

                <input
                    onChange={(event) => {
                        setUserBio(event.target.value);
                    }}
                    value={userBio}
                    className="bg-emerald-100  px-8 py-1 w-[100%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded  border-2 border-sky-400  "
                    type="text"
                    placeholder="Enter Your Bio"
                />
                <button className="bg-sky-400 px-6 py-1 rounded active:scale-95 font-extrabold text-white">
                    Subimt
                </button>
            </form>

            <div className="card-container w-[full] h-screen flex gap-4 flex-wrap bg-slate-800 overflow-x-auto   ">
                {allUsers.map((user, index) => {
                    return (
                        <Card
                            key={index}
                            index={index}
                            name={user.userName}
                            image={user.image}
                            bio={user.userBio}
                            deleteHandel={deleteHandel}
                            roll={user.userRoll}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default App;
