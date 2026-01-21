import { useEffect, useState } from "react";
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

const Sidebar = () => {
  // const pathname = useLocation().pathname;
  const { label } = useEditLaber();
  const { pathname } = useLocation();

  const [isActive, setisActive] = useState<number | null>(null);

  useEffect(() => {
    if (pathname === "/") {
      setisActive(1);
    }
  }, []);

  const { size, isMobile, isTablet } = useScreenSize();
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
      path: `/editlabel/${encodeURIComponent(removeSpacing(item.categoryName))}`,
    }));

  const SideBarData = [
    {
      id: 1,
      icon: <FaRegLightbulb />,
      title: "Notes",
      path: "/",
    },
    {
      id: 2,
      icon: <FaBell />,
      title: "Reminders",
      path: "/reminders",
    },
    ...labelSidebarItems,
    {
      id: 3,
      icon: <MdEdit />,
      title: "Edit labels",
      path: "#",
    },
    {
      id: 4,
      icon: <IoMdArchive />,
      title: "Archive",
      path: "/archieve",
    },
    {
      id: 5,
      icon: <MdDelete />,
      title: "Bin",
      path: "/bin",
    },
  ];

  useEffect(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [size]);

  const { isOpen, setIsOpen } = useSidebar();
  return (
    <>
      <div className={`${isOpen ? "w-[250px]" : `w-fit`} cursor-pointer `}>
        <ul
          className={`py-4 
                transition-all 
                `}
        >
          {SideBarData.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <li
                  className={`py-4 h-[50px] ${isOpen ? `pl-4 ml-0 w-[250px] rounded-r-[25px]` : `pl-0  w-[50px] rounded-full md:ml-4`} flex     overflow-hidden   gap-4 hover:bg-secondary ${isActive && (pathname === item.path ? `bg-primary` : "hover:bg-secondary")} `}
                  key={item.id}
                  onClick={() => {
                    HandleClick(item.id);
                  }}
                >
                  <div
                    data-tooltip-id={`tooltip-${item.id}`}
                    data-tooltip-content={item.title}
                    className={`cursor-pointer pl-[17px] flex items-center  text-nowrap`}
                  >
                    {item.icon}
                  </div>
                  {isOpen && (
                    <div
                      className={`cursor-pointer  flex items-center  text-nowrap  `}
                    >
                      <p className="text-body">{item.title}</p>
                    </div>
                  )}
                  {!isOpen && <Tooltip id={`tooltip-${item.id}`} />}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      {isActive === 3 && <Dialougebox setisActive={setisActive} />}
    </>
  );
};

export default Sidebar;

// const baseSidebarData = [
//   {
//     id: 1,
//     icon: <FaRegLightbulb />,
//     title: "Notes",
//     path: "/",
//   },
//   {
//     id: 2,
//     icon: <FaBell />,
//     title: "Reminders",
//     path: "/reminders",
//   },
//   {
//     id: 3,
//     icon: <MdEdit />,
//     title: "Edit labels",
//     path: "#",
//   },
//   {
//     id: 4,
//     icon: <IoMdArchive />,
//     title: "Archive",
//     path: "/archieve",
//   },
//   {
//     id: 5,
//     icon: <MdDelete />,
//     title: "Bin",
//     path: "/bin",
//   },
// ];

// const labelSidebarItems = label
//   .filter(item => item.label.trim() !== "")
//   .map((item, index) => ({
//     id: 110 + index,
//     icon: <TbLabelFilled />,
//     title: item.label,
//     path: `/editlabel/${encodeURIComponent(item.label)}`,
//   }));

// const SideBarData = [
//   ...baseSidebarData.slice(0, 2),
//   ...labelSidebarItems,
//   ...baseSidebarData.slice(2),
// ];
