import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";

const App = () => {
   
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
        </div>
    );
};

export default App;
