import {
  FaCreditCard,
  FaIdCard,
  FaPalette,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrashAlt,
  FaUserCog,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileLowerSidebar = () => {
  const settingLayout = [
    {
      id: 1,
      title: "Personal Info",
      path: "/setting/personal-info",
      description: "Name, email, phone, address",
      icons: <FaIdCard />,
    },
    {
      id: 2,
      title: "User Preferences",
      path: "/setting/user-preferences",
      description: "Language, timezone, auto Logout",
      icons: <FaUserCog />,
    },
    {
      id: 3,
      title: "Subscription",
      path: "/setting/subscription",
      description: "Manage your subscription plan",
      icons: <FaCreditCard />,
    },
    {
      id: 4,
      title: "Security",
      path: "/setting/security",
      description: "Change password, 2FA, app passwords",
      icons: <FaShieldAlt />,
    },
    {
      id: 5,
      title: "Appearance",
      description: "Theme, layout, font size",
      path: "/setting/appearance",
      icons: <FaPalette />,
    },
    {
      id: 6,
      title: "Logout",
      path: "/setting/logout",
      description: "Sign out of your account",
      icons: <FaSignOutAlt />,
    },
    {
      id: 7,
      title: "Delete Account",
      path: "/setting/delete-account",
      description: "Permanently delete your account",
      icons: <FaTrashAlt />,
    },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="w-full p-4 ">
      <div className="flex flex-col gap-4 w-full">
        {settingLayout.map((item) => (
          <div
            key={item.id}
            className={`  px-4 w-full py-2 cursor-pointer flex itmems-center gap-4  rounded-[8px]  border border-[#525355] ${pathname === item.path ? "bg-[#41331C]" : "hover:bg-[#52535596]"} `}
            onClick={() => {
              // setactive(item.id);
              if (item.title === "Home") {
                navigate(item.path);
                return;
              }
              navigate(item.path);
            }}
          >
            <div className="flex items-center ">{item.icons}</div>
            <div className="">
              <h1 className="font-bold ">{item.title}</h1>
              <p className="text-[12px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileLowerSidebar;
