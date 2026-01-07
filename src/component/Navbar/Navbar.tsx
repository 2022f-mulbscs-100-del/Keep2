import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdRefresh } from "react-icons/io";
import { TbLayoutList } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
// import Input from "../InputFields/Input";
import { LuLayoutGrid } from "react-icons/lu";
import { useSidebar } from "../../Context/sidebarContext";
import { useNavbar } from "../../Context/navbarContext";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeSwitcherButton from "../Buttons/ThemeSwitcherButton";
import { PiCodesandboxLogo } from "react-icons/pi";
import SandboxModal from "../SandboxModal";
import { useState } from "react";
import { useNote } from "../../Context/noteContext";
import { useUser } from "../../Context/UserContext";
import { Tooltip } from "react-tooltip";
import { useScreenSize } from "../CustomHooks/useScreenSize";

const Navbar = () => {
  const { pathname: path } = useLocation();
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const { fetchApiData } = useNote();
  const { isOpen, setIsOpen } = useSidebar();
  const { layout, setLayout } = useNavbar();
  const { profileData } = useUser();
  const navigate = useNavigate();

  const { isMobile, isTablet } = useScreenSize();

  return (
    <>
      <div
        className="grid grid-cols-[auto_1fr_auto]    items-center text-[20px] border-b border-[#525355]
      
      md:px-8 md:py-4 md:gap-8
      xsm:p-4

      transition-all duration-300
      "
      >
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
              {path === "/setting" || path.startsWith("/setting/")
                ? path.slice(9, 10).toUpperCase() + path.slice(10)
                : path === "/" || path.slice(0, 6) === "/notes"
                  ? `Keeper`
                  : path.slice(1, 2).toUpperCase() + path.slice(2)}
            </h1>
          </div>
        </div>

        {/* input field */}

        {/* <div className="lg:pr-50
        ">
          <Input />
        </div> */}

        <div className="flex justify-end items-center gap-16">
          {!isTablet && !isMobile && (
            <div className="flex items-center gap-4">
              <div
                data-tooltip-id="refresh-tooltip"
                data-tooltip-content="Refresh"
              >
                <IoMdRefresh
                  className="cursor-pointer"
                  onClick={() => {
                    fetchApiData();
                  }}
                />
              </div>

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

              <div
                data-tooltip-id="setting-tooltip"
                data-tooltip-content="Settings"
              >
                <IoSettingsOutline
                  className="cursor-pointer"
                  onClick={() => navigate("/setting/personal-info")}
                />
              </div>

              <div
                data-tooltip-id="theme-switcher-tooltip"
                data-tooltip-content="Change Theme"
              >
                <ThemeSwitcherButton />
              </div>
              <div
                data-tooltip-id="sandbox-tooltip"
                data-tooltip-content="Sandbox"
              >
                <PiCodesandboxLogo
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSandboxOpen(true);
                  }}
                />
              </div>
              {sandboxOpen && (
                <SandboxModal
                  onclose={() => {
                    setSandboxOpen(false);
                  }}
                />
              )}
            </div>
          )}

          <div data-tooltip-id="profile-tooltip" data-tooltip-content="Profile">
            <div
              className="w-[30px] h-[30px] bg-amber-900 rounded-full cursor-pointer overflow-hidden"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <img
                className="object-cover w-full h-full "
                src={profileData?.profileImage}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="refresh-tooltip" place="top" />
      <Tooltip id="theme-switcher-tooltip" place="top" />
      <Tooltip id="sandbox-tooltip" place="top" />
      <Tooltip id="profile-tooltip" place="top" />
      <Tooltip id="setting-tooltip" place="top" />
    </>
  );
};

export default Navbar;
