"use client";
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

const Sidebar = () => {
  const { label } = useEditLaber();
  const [isActive, setisActive] = useState<number | null>(null);

  const { size, isMobile, isTablet } = useScreenSize();
  const HandleClick = (id: number) => {
    setisActive(id);
  };
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

  const AddingLabelSidebar = (title: string, id: number) => {
    SideBarData.splice(2, 0, {
      id: 110 + id,
      icon: <TbLabelFilled />,
      title: title,
      path: `/editlabel/${title}`,
    });
  };

  {
    label.map((item: string, index: number) => {
      AddingLabelSidebar(item, index);
    });
  }

  useEffect(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [size]);

  const { pathname } = useLocation();

  const { isOpen, setIsOpen } = useSidebar();
  return (
    <>
      <div className={`   ${isOpen ? "w-[250px]" : `w-fit`} cursor-pointer `}>
        <ul
          className={`py-4 
                transition-all 
                `}
        >
          {SideBarData.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <li
                  className={`py-4 h-[50px] ${isOpen ? `pl-4 ml-0 w-[250px] rounded-r-[25px]` : `pl-0  w-[50px] rounded-full md:ml-4`} flex     overflow-hidden   gap-4 hover:bg-[#36363898] ${isActive && (pathname === item.path ? `bg-[#41331C]` : "hover:bg-[#36363898]")} `}
                  key={item.id}
                  onClick={() => {
                    HandleClick(item.id);
                  }}
                >
                  <div
                    className={`cursor-pointer pl-[17px] flex items-center  text-nowrap`}
                  >
                    {item.icon}
                  </div>
                  {isOpen && (
                    <div
                      className={`cursor-pointe  flex items-center  text-nowrap`}
                    >
                      {item.title}
                    </div>
                  )}
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
