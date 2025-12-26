import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

type ProfileDataType = {
  name: string;
  email: string;
  profileImage: string;
  phone: number | null;
};

type userContextType = {
  profileData: ProfileDataType | null;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType | null>>;
  fetchUserProfile: () => void;
};

const UserContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileData, setProfileData] = useState<ProfileDataType | null>({
    name: "",
    email: "",
    profileImage: "",
    phone: null,
  });

  const fetchUserProfile = () => {
    axiosClient
      .get(`/userProfile`)
      .then((res) => setProfileData(res.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <UserContext.Provider
      value={{ profileData, setProfileData, fetchUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

//eslint-disable-next-line
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be use with in the userContext");
  }
  return context;
};
