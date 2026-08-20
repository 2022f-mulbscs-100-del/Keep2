import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegLightbulb } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdArchive } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { TbLabelFilled } from "react-icons/tb";

import { useEditLaber } from "../../Context/editLabelContext";
import Dialougebox from "../EditLabelDialougebox";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../Context/sidebarContext";
import { useScreenSize } from "../CustomHooks/useScreenSize";
import { Tooltip } from "react-tooltip";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { t } = useTranslation();

  const { label } = useEditLaber();
  const { pathname } = useLocation();
  const { profileData } = useUser();

  const { size, isMobile, isTablet } = useScreenSize();
  const { isOpen, setIsOpen } = useSidebar();

  const isActiveSubscriber =
    profileData?.subscriptionStatus === "active";

  const [isActive, setisActive] = useState<number | null>(null);

  // Login / Signup pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup";


  const shouldOverlaySidebar =
    isMobile && isAuthPage;

  useEffect(() => {
    if (pathname === "/") {
      setisActive(1);
    }
  }, [pathname]);

  const HandleClick = (id: number) => {
    setisActive(id);
  };

  const removeSpacing = (str: string) => {
    return str.replace(/\s+/g, "-");
  };

  const labelSidebarItems = label
    .filter((item) => item?.categoryName?.trim() !== "")
    .map((item, index) => ({
      id: 110 + index,
      icon: <TbLabelFilled />,
      title: item.categoryName,
      path: `/editlabel/${encodeURIComponent(
        removeSpacing(item.categoryName)
      )}`,
      isPremium: false,
    }));

  const SideBarData = [
    {
      id: 1,
      icon: <FaRegLightbulb />,
      title: t("navigation.notes"),
      path: "/",
      isPremium: false,
    },
    {
      id: 2,
      icon: <FaBell />,
      title: t("navigation.reminders"),
      path: "/reminders",
      isPremium: true,
    },

    ...labelSidebarItems,

    {
      id: 3,
      icon: <MdEdit />,
      title: t("navigation.editLabels"),
      path: "#",
      isPremium: false,
    },
    {
      id: 4,
      icon: <IoMdArchive />,
      title: t("navigation.archive"),
      path: "/archieve",
      isPremium: false,
    },
    {
      id: 5,
      icon: <MdDelete />,
      title: t("navigation.bin"),
      path: "/bin",
      isPremium: false,
    },
  ];

  useEffect(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [size, isMobile, isTablet, setIsOpen]);

  return (
    <>
      <div
        className={`
          ${isOpen ? "w-[250px]" : "w-fit"}
          cursor-pointer

          ${
            shouldOverlaySidebar
              ? "absolute top-21 h-full bg-black left-0 z-[9999]"
              : "relative"
          }
        `}
      >
        <ul
          className="
            py-4
            transition-all
          "
        >
          {SideBarData.map((item) => {
            const isDisabled =
              item.isPremium && !isActiveSubscriber;

            const SidebarItem = (
              <li
                key={item.id}
                className={`
                  py-4
                  h-[50px]

                  ${
                    isOpen
                      ? "pl-4 ml-0 w-[250px] rounded-r-[25px]"
                      : "pl-0 w-[50px] rounded-full md:ml-4"
                  }

                  flex
                  overflow-hidden
                  gap-4
                  hover:bg-secondary

                  ${
                    isActive &&
                    pathname === item.path
                      ? "bg-primary"
                      : "hover:bg-secondary"
                  }

                  ${isDisabled ? "opacity-50" : ""}
                `}
                onClick={() => {
                  if (isDisabled) {
                    toast.info(
                      "Upgrade to Pro to use Reminders. Go to Settings > Subscription to upgrade."
                    );

                    return;
                  }

                  HandleClick(item.id);
                }}
              >
                {/* ICON */}
                <div
                  data-tooltip-id={`tooltip-${item.id}`}
                  data-tooltip-content={
                    isDisabled
                      ? "Upgrade to Pro to use Reminders"
                      : item.title
                  }
                  className="
                    cursor-pointer
                    pl-[17px]
                    flex
                    items-center
                    text-nowrap
                  "
                >
                  {item.icon}
                </div>

                {/* TITLE */}
                {isOpen && (
                  <div
                    className="
                      cursor-pointer
                      flex
                      items-center
                      text-nowrap
                    "
                  >
                    <p className="text-body">
                      {item.title}
                    </p>
                  </div>
                )}

                {/* MOBILE TOOLTIP */}
                {!isOpen && (
                  <Tooltip id={`tooltip-${item.id}`} />
                )}
              </li>
            );

            /*
             * Premium item:
             * Don't navigate when user isn't subscribed.
             */
            if (isDisabled) {
              return (
                <div key={item.id}>
                  {SidebarItem}
                </div>
              );
            }

            /*
             * Normal sidebar item.
             */
            return (
              <Link
                to={item.path}
                key={item.id}
              >
                {SidebarItem}
              </Link>
            );
          })}
        </ul>
      </div>

      {/* Edit Labels Dialog */}
      {isActive === 3 && (
        <Dialougebox
          setisActive={setisActive}
        />
      )}
    </>
  );
};

export default Sidebar;