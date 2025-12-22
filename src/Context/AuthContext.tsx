import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ExtractName } from "../utils/ExtractName";

type UserDataType = {
  id: number;
  name: string;
  email: string;
  profileImage: string;
};

type AuthContextType = {
  userData: UserDataType | null;
  isLoading: boolean;
  LoginHandler: (loginData: LoginDatatype) => void;
  isDisable: boolean;
  accessToken: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);
type LoginDatatype = {
  email: string;
  password: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDisable = userData === null;
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:2404/refresh", { withCredentials: true })
      .then((res) => {
        setUserData(res.data.rest);
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(res.data.rest));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUserData(null);
        setIsLoading(false);
      });
  }, []);

  const LoginHandler = async (loginData: LoginDatatype) => {
    setIsLoading(true);
    axios
      .post("http://localhost:2404/api/login", loginData, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(res.data.rest);
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(res.data.rest));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    try {
      const response = await axios.post(
        "http://localhost:2404/api/send-email",
        {
          email: loginData.email,
          name: ExtractName(loginData.email),
          templateId: 1,
          params: {
            name: ExtractName(loginData.email),
          },
        },
      );

      console.log("Email sent successfully:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userData, LoginHandler, isLoading, isDisable, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//eslint-disable-next-line
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
