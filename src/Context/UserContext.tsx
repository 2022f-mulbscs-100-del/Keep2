import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { ProfileDataType } from "../types/User.types";
import { Logger } from "../utils/Logger";
import { UserInputSchema } from "../validation/validation";

const UserContext = createContext<userContextType | null>(null);
export type userContextType = {
  profileData: ProfileDataType | null;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType | null>>;
  fetchUserProfile: () => Promise<void>;
  UpdateUserProfile: (profileData: ProfileDataType) => Promise<ProfileDataType>;
  error?: { ProfileError: string | null };
  isLoading?: boolean;
  setError?: React.Dispatch<
    React.SetStateAction<{ ProfileError: string | null }>
  >;
};
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<{ ProfileError: string | null }>({
    ProfileError: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileDataType | null>({
    name: "",
    email: "",
    profileImage: "",
    phone: null,
    isTwoFaEnabled: false,
    autoLogoutEnabled: false,
    autoLogoutTime: null,
    subscriptionPlan: "free",
    subscriptionStatus: "inactive",
  });

  const fetchUserProfile = async (): Promise<void> => {
    setIsLoading(true);
    axiosClient
      .get(`/userProfile`)
      .then((res) => {
        setIsLoading(false);
        setProfileData(res.data);
      })
      .catch((error) => {
        setIsLoading(false);
        Logger("error fetching user profile", error);
        setError({
          ...error,
          ProfileError: error.message || "Error fetching user profile",
        });
      });
  };

  const UpdateUserProfile = async (
    profileData: ProfileDataType,
  ): Promise<ProfileDataType> => {
    try {
      setIsLoading(true);
      UserInputSchema.parse(profileData);
      const res = await axiosClient.patch("/updateProfile", { profileData });
      setProfileData(res.data);
      return res.data;
      // eslint-disable-next-line
    } catch (error: string | any) {
      setIsLoading(false);
      Logger("Error updating profile", error);
      setError({
        ...error,
        ProfileError: error.message || "Error updating profile",
      });
      throw error;
    }
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
        setError,
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
