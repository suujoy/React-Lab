import React, { useContext } from "react";
import SingleMovie from "./SingleMovie";
import { AllMoviesDataContext } from "../context/AllMoviesContext";

const Movie = () => {
    const allMovies = useContext(AllMoviesDataContext);

    console.log(allMovies[0]);
    return (
        <div
            id="moviepage"
            className="bg-slate-800 w-full h-[calc(100vh-140px)] p-3 flex flex-wrap  gap-2 overflow-y-scroll "
        >
            {allMovies.map((movie, index) => {
                return (
                    <div key={index}>
                        <SingleMovie title = {movie.title} poster = {movie.poster_path} />
                    </div>
                );
            })}
        </div>
    );
};

export default Movie;
