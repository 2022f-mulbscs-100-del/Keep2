import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdRefresh } from "react-icons/io";
import { TbLayoutList } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import Input from "../InputFields/Input";
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
import IconStyling from "../IconStyling";

const Navbar = () => {
  const { pathname: path } = useLocation();
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const { fetchApiData } = useNote();
  const { isOpen, setIsOpen } = useSidebar();
  const { layout, setLayout } = useNavbar();
  const { profileData } = useUser();
  const navigate = useNavigate();
  const { UpdateUserProfile } = useUser();

  const updateLayout = async (newLayout: boolean) => {
    setLayout(newLayout);
    await UpdateUserProfile({
      layout: newLayout ? "list" : "grid",
    });
    console.log("layout updated to user profile");
  };

  const { isMobile, isTablet } = useScreenSize();

  return (
    <>
      <div
        className="grid grid-cols-[auto_1fr_auto]    items-center text-[20px] border-b border-borderColor
      
      md:px-8 md:py-4 md:gap-8
      xsm:p-4

      transition-all duration-300
      "
      >
        {/* logo and title */}
        <div className=" items-center  w-fit">
          <div className="flex items-center gap-4">
            <RxHamburgerMenu
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            <h1 className="text-subheading2 w-fit">
              {path === "/setting" || path.startsWith("/setting/")
                ? path.slice(9, 10).toUpperCase() + path.slice(10)
                : path === "/" || path.slice(0, 6) === "/notes"
                  ? `Keeper`
                  : path.slice(1, 2).toUpperCase() + path.slice(2)}
            </h1>
          </div>
        </div>

        {/* input field */}

        <div
          className="
        px-4
        "
        >
          <Input />
        </div>

        <div className="flex justify-end items-center gap-16">
          {!isTablet && !isMobile && (
            <div className="flex items-center gap-4">
              <div>
                <IconStyling
                  icon={IoMdRefresh}
                  id={1}
                  tooltip="Refresh"
                  onclick={() => {
                    fetchApiData();
                  }}
                />
              </div>

              {layout ? (
                <IconStyling
                  icon={LuLayoutGrid}
                  id={2}
                  tooltip="Grid View"
                  onclick={() => {
                    updateLayout(false);
                  }}
                />
              ) : (
                <IconStyling
                  icon={TbLayoutList}
                  id={1}
                  tooltip={"List View"}
                  onclick={() => {
                    updateLayout(true);
                  }}
                />
              )}

              <div>
                <IconStyling
                  icon={IoSettingsOutline}
                  id={1}
                  tooltip="Setting"
                  onclick={() => {
                    navigate("/setting/personal-info");
                  }}
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
                    e.stopPropagation(); //prevents parent elements from reacting to the same event.
                    setSandboxOpen(true); // when i click on the icon the modal opens but immediately closes because of the overlay click handler in SandboxModal.tsx so to prevent that we use e.stopPropagation()
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
              className="w-[30px] h-[30px] bg-secondary rounded-full cursor-pointer overflow-hidden"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <img
                className="object-cover w-full h-full "
                src={profileData?.profileImage || "/HN-PAT-ALK-2000X2000-2.jpg"}
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
