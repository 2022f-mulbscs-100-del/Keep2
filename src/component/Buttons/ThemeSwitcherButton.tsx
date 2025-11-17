import { useState } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { useTheme } from "../../zustand/ThemeSwitcherStore";


function ThemeSwitcherButton() {

  const [click ,setClick] = useState(true)
  const {setTheme} = useTheme();
  return (
    <>
    <div className="cursor-pointer"
    onClick={
       ()=>{ 
        const newClick = !click;
        setClick(newClick)
        setTheme(newClick ? "dark" : "light")
       }
    }
    >
  {click ?   <CiDark/> : <MdOutlineLightMode/> }
  
    </div>
    
    </>

  )
}

export default ThemeSwitcherButton