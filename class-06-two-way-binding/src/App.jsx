import React, { useState } from "react";

const App = () => {
    const formHandel = (event) => {
        event.preventDefault();
    };

    const [name, setName] = useState('')

    return (
        <div>
            <form
                onSubmit={(event) => {
                    formHandel(event);
                }}
            >
                <input onChange={(event)=>{
                    setName(event.target.value)
                }} value={name} type="text" placeholder="What is your name" />
                <button>Submit</button>
            </form>
        </div>
    );
};

export default App;
