import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";
import About from "./pages/About";
import Search from "./pages/Search";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";

const App = () => {
    return (
        <div>
            <Navbar />
            <Search />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie" element={<Movie />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
