// import { useState } from "react";
import {
  FaCreditCard,
  FaIdCard,
  FaKey,
  FaPalette,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrashAlt,
  FaUserCog,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const settingLayout = [
    {
      id: 1,
      title: t("settings.personalInfo"),
      path: "/setting/personal-info",
      icons: <FaIdCard />,
    },
    {
      id: 2,
      title: t("settings.userPreferences"),
      path: "/setting/user-preferences",
      icons: <FaUserCog />,
    },
    {
      id: 3,
      title: t("settings.subscriptionMenu"),
      path: "/setting/subscription",
      icons: <FaCreditCard />,
    },
    {
      id: 4,
      title: t("settings.securityMenu"),
      path: "/setting/security",
      icons: <FaShieldAlt />,
    },
    {
      id: 5,
      title: t("settings.apiKeysMenu"),
      path: "/setting/api-keys",
      icons: <FaKey />,
    },
    {
      id: 6,
      title: t("settings.appearance"),
      path: "/setting/appearance",
      icons: <FaPalette />,
    },
    {
      id: 7,
      title: t("settings.logoutMenu"),
      path: "/setting/logout",
      icons: <FaSignOutAlt />,
    },
    {
      id: 8,
      title: t("settings.deleteAccountMenu"),
      path: "/setting/delete-account",
      icons: <FaTrashAlt />,
    },
  ];

  // const [active, setactive] = useState(0);
  const { pathname } = useLocation();

  return (
    <div className="flex justify-end mr-10 mt-5">
      <div className=" w-fit flex justify-end">
        <div className="flex flex-col gap-2 items-end">
          {settingLayout.map((item) => (
            <div
              key={item.id}
              className={` w-fit px-4 py-2 rounded-[20px] cursor-pointer flex gap-4 items-center ${pathname === item.path ? "bg-primary" : "hover:bg-secondary"} `}
              onClick={() => {
                // setactive(item.id);
                if (item.title === "Home") {
                  navigate(item.path);
                  return;
                }
                navigate(item.path);
              }}
            >
              <p className="text-body">{item.title}</p>
              {item.icons}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
