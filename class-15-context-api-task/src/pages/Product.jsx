import React, { useContext } from "react";
import { ProductDataContext } from "../context/ProductContext";
import { Link } from "react-router-dom";

const Product = () => {
    const productData = useContext(ProductDataContext);

    return (
        <div className="flex flex-wrap bg-black gap-4">
            {productData.map((val, index) => {
                return (
                    <Link
                        key={index}
                        className="block w-[250px] rounded-xl bg-white/20 text-white flex flex-col gap-4 p-3"
                        to={`/products/${val.id}`}
                    >
                        <div>
                            <img
                                className="w-[200px] h-[250px] object-cover "
                                src={val.image}
                                alt=""
                            />
                            <h2>{val.title}</h2>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default Product;
