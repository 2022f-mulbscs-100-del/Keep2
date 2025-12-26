import type React from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useParams } from "react-router-dom";
import Security from "../Settings/Security/Security";
import DeleteAccount from "../Settings/DeleteAccount";
import Theme from "../Settings/Theme";
import Logout from "../Settings/Logout";
import PersonalInfo from "../Settings/PersonalInfo";
import UserPrefrence from "../Settings/UserPrefrence";
import SubscriptionPage from "../Settings/SubscriptionPage";
import { useScreenSize } from "../../component/CustomHooks/useScreenSize";

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { isMobile, isTablet, size } = useScreenSize();
  console.log("isMobile:", isMobile, "isTablet:", isTablet);
  console.log("size", size);
  return (
    <div className="flex  ">
      <div className={`${!isMobile && !isTablet ? "flex-1" : "w-full"}  `}>
        {id === undefined && children}
        {id === "personal-info" && <PersonalInfo />}
        {id === "subscription" && <SubscriptionPage />}
        {id === "user-preferences" && <UserPrefrence />}
        {id === "security" && <Security />}
        {id === "delete-account" && <DeleteAccount />}
        {id === "appearance" && <Theme />}
        {id === "logout" && <Logout />}
      </div>
      {size >= 1000 && (
        <div>
          <ProfileSidebar />
        </div>
      )}
    </div>
  );
};

export default SettingLayout;
