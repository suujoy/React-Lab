import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(`Email is ${email}`);
        console.log(`Password is ${password}`);

        setEmail('')
        setPassword('')
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center ">
            <div className="border-2 border-emerald-600 rounded-xl">
                <form
                    onSubmit={(event) => {
                        submitHandler(event);
                    }}
                    className="flex flex-col gap-4 p-3   items-center justify-center "
                >
                    <input
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        value={email}
                        required
                        type="email"
                        placeholder="Enter Email"
                        className="w-full bg-transparent rounded-xl text-white px-5 py-2 outline-none border-2 border-emerald-600   "
                    />
                    <input
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        required
                        type="password"
                        placeholder="Enter Password"
                        className="w-full bg-transparent rounded-xl text-white px-5 py-2 outline-none border-2 border-emerald-600  "
                    />

                    <button className="w-full  rounded-xl text-white px-5 py-2 outline-none  bg-emerald-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
