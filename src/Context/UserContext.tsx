import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

type ProfileDataType = {
  name?: string;
  email?: string;
  profileImage?: string;
  phone?: number | null;
  isTwoFaEnabled?: boolean;
  autoLogoutEnabled?: boolean;
  autoLogoutTime?: number;
  MfaEnabled?: boolean;
};

type userContextType = {
  profileData: ProfileDataType | null;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType | null>>;
  fetchUserProfile: () => void;
  UpdateUserProfile: (profileData: ProfileDataType) => void;
  error?: string | null;
  isLoading?: boolean;
};

const UserContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileDataType | null>({
    name: "",
    email: "",
    profileImage: "",
    phone: null,
    isTwoFaEnabled: false,
  });

  const fetchUserProfile = () => {
    setIsLoading(true);
    axiosClient
      .get(`/userProfile`)
      .then((res) => {
        setIsLoading(false);
        setProfileData(res.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  const UpdateUserProfile = (profileData: ProfileDataType) => {
    setIsLoading(true);
    axiosClient
      .patch("/updateProfile", { profileData })
      .then((res) => {
        setIsLoading(false);
        setProfileData(res.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <UserContext.Provider
      value={{
        profileData,
        setProfileData,
        fetchUserProfile,
        UpdateUserProfile,
        error,
        isLoading,
      }}
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
