import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Section from "./Section";

const App = () => {
    return (
        <div id=" app" className="bg-black w-full h-screen">
            <Navbar />
            <Section >
                <h1>Halku re</h1>
                <h2>Batman re</h2>
            </Section>
            <Footer/>
        </div>
    );
};

export default App;
