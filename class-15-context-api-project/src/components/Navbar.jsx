import { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Navbar = () => {
    const [theme,setTheme] = useContext(ThemeDataContext);

    return (
        <div className="w-full px-9 py-2 flex justify-between bg-pink-500 ">
            <h1>Navbar</h1>
            {theme}
            <button onClick={()=>{
                if(theme==='Light'){
                    setTheme('Dark')
                }else setTheme('Light')
            }} className="bg-emerald-700 rounded text-xl text-white font-bold px-5 py-1 active:scale-95    ">Change Theme</button>
        </div>
    );
};

export default Navbar;
