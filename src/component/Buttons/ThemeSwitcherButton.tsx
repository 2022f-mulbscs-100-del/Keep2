import { useState } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { useTheme } from "../../Context/themeSwitcherContext";

function ThemeSwitcherButton() {
  const [click, setClick] = useState(true);
  const { settingTheme } = useTheme();
  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          const newClick = !click;
          setClick(newClick);
          settingTheme(newClick ? "dark" : "light");
        }}
      >
        {click ? <CiDark /> : <MdOutlineLightMode />}
      </div>
    </>
  );
}

export default ThemeSwitcherButton;
