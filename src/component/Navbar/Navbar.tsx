import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdRefresh } from "react-icons/io";
import { TbLayoutList } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import Input from "../InputFields/Input";
import { LuLayoutGrid } from "react-icons/lu";
import { useSidebar } from "../../Context/sidebarContext";
import { useNavbar } from "../../Context/navbarContext";
import { useLocation } from "react-router-dom";
import ThemeSwitcherButton from "../Buttons/ThemeSwitcherButton";
import { PiCodesandboxLogo } from "react-icons/pi";
import SandboxModal from "../SandboxModal";
import { useState } from "react";

const Navbar = () => {
  const { pathname: path } = useLocation();
  const [sandboxOpen, setSandboxOpen] = useState(false);

  const { isOpen, setIsOpen } = useSidebar();
  const { layout, setLayout } = useNavbar();
  return (
    <>
      <div className="grid grid-cols-[auto_1fr_auto]  gap-8 px-8 py-2 items-center text-[20px] border-b border-[#525355]">
        {/* logo and title */}
        <div className=" items-center gap-30 w-[130px]">
          <div className="flex items-center gap-4">
            <RxHamburgerMenu
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />

            <h1>
              {path === "/" || path.slice(0, 6) === "/notes"
                ? `Keeper`
                : path.slice(1, 2).toUpperCase() + path.slice(2)}
            </h1>
          </div>
        </div>

        {/* input field */}

        <div className="pr-50">
          <Input />
        </div>

        <div className="flex justify-end items-center gap-16">
          <div className="flex items-center gap-4">
            <IoMdRefresh />

            {layout ? (
              <LuLayoutGrid
                className="cursor-pointer"
                onClick={() => {
                  setLayout(false);
                }}
              />
            ) : (
              <TbLayoutList
                className="cursor-pointer"
                onClick={() => {
                  setLayout(true);
                }}
              />
            )}

            <IoSettingsOutline />
            <ThemeSwitcherButton />

            <PiCodesandboxLogo
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSandboxOpen(true);
              }}
            />
            {sandboxOpen && (
              <SandboxModal
                onclose={() => {
                  setSandboxOpen(false);
                }}
              />
            )}
          </div>
          <div>
            <div className="w-[30px] h-[30px] bg-amber-900 rounded-full">
              <img src="#" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
