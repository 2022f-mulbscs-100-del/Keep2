import type React from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useParams } from "react-router-dom";
import Security from "../Settings/Security";
import DeleteAccount from "../Settings/DeleteAccount";
import Theme from "../Settings/Theme";
import Logout from "../Settings/Logout";
import PersonalInfo from "../Settings/PersonalInfo";
import UserPrefrence from "../Settings/UserPrefrence";
import SubscriptionPage from "../Settings/SubscriptionPage";

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  console.log(id);
  return (
    <div className="flex  ">
      <div className="flex-1">
        {id === undefined && children}
        {id === "personal-info" && <PersonalInfo />}
        {id === "subscription" && <SubscriptionPage />}
        {id === "user-preferences" && <UserPrefrence />}
        {id === "security" && <Security />}
        {id === "delete-account" && <DeleteAccount />}
        {id === "appearance" && <Theme />}
        {id === "logout" && <Logout />}
      </div>
      <ProfileSidebar />
    </div>
  );
};

export default SettingLayout;
