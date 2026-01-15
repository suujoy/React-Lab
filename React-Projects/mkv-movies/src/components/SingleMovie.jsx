import { Link } from "react-router-dom";

const SingleMovie = (props) => {
    const imgPath = `https://image.tmdb.org/t/p/w500`;

    return (
        <Link
            to={`/movie/${props.id}`}
            className="flex flex-col border-2 border-slate-600 rounded-xl bg-slate-900 p-2 w-[290px]"
        >
            <img
                className="rounded-xl mb-5  "
                src={`${imgPath}${props.poster}`}
                alt=""
            />
            <h3 className="text-white text-xl font-bold"> {props.title}</h3>
        </Link>
    );
};

export default SingleMovie;
