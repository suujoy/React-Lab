import React, { useState } from "react";


const Navbar = (props) => {
    const [newTheme, setnewTheme] = useState("");


    return (
        <div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    console.log(newTheme);
                    setnewTheme("");
                }}
            >
                <input
                    onChange={(event) => {
                        setnewTheme(event.target.value);
                    }}
                    value={newTheme}
                    type="text"
                    placeholder="Enter Theme"
                />
                <button
                    onClick={() => {
                       props.changeTheme(newTheme)
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Navbar;
