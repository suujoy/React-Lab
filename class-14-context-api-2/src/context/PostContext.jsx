import React, { createContext } from "react";

export const PostDataContext = createContext();

const PostContext = ({ children }) => {
    const user = 'Sujoy';

    return <div>
        <PostDataContext.Provider value={user}>
            {children}
        </PostDataContext.Provider>
    </div>;
};

export default PostContext;
