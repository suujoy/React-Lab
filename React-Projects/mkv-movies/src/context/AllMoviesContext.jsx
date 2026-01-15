import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AllMoviesDataContext = createContext();

const AllMoviesContext = ({ children }) => {
    const apiKey = `a2a0c50a89ba45eac3d3df4272eac703`;

    const [allMovies, setAllMovies] = useState([]);

    const getTrandingMovie = async () => {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
        );
        setAllMovies(data.results);
    };

    useEffect(() => {
        getTrandingMovie();
    }, []);

    return (
        <div>
            <AllMoviesDataContext.Provider value={allMovies}>
                {children}
            </AllMoviesDataContext.Provider>
        </div>
    );
};

export default AllMoviesContext;
