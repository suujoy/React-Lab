import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ProductDataContext = createContext();

const ProductContext = (props) => {
    const [productData, setProductData] = useState([]);

    const getData = async () => {
        const { data } = await axios.get(`https://fakestoreapi.com/products`);

        setProductData(data);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <ProductDataContext.Provider value={productData}>
                {props.children}
            </ProductDataContext.Provider>
        </div>
    );
};

export default ProductContext;
