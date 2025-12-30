import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  SignUpHandler: (signUpData: SignUpDatatype) => void;
  loginStage: string;
  TwoFaLoginHandler: (loginData: LoginDatatype, twoFaCode: string) => void;
  setLoginStage: (stage: string) => void;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);
type LoginDatatype = {
  email: string;
  password: string;
};

type SignUpDatatype = {
  name: string;
  email: string;
  password: string;
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStage, setLoginStage] = useState("login");
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
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
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
        if (res.data.message === "2FA enabled") {
          setLoginStage("2FA");
          setIsLoading(false);
          return;
        } else {
          setLoginStage("success");
          console.log(loginStage);
          setUserData(res.data.rest);
          setAccessToken(res.data.accessToken);
          sessionStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("userData", JSON.stringify(res.data.rest));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setLoginStage("failed");
        console.log(err);
        setIsLoading(false);
      });

    // try {
    //   const response = await axios.post(
    //     "http://localhost:2404/api/send-email",
    //     {
    //       email: loginData.email,
    //       name: ExtractName(loginData.email),
    //       templateId: 1,
    //       params: {
    //         name: ExtractName(loginData.email),
    //       },
    //     },
    //   );

    //   console.log("Email sent successfully:", response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const TwoFaLoginHandler = async (
    loginData: LoginDatatype,
    twoFaCode: string,
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:2404/api/2fa-login",
        { email: loginData.email, twoFaCode },
        {
          withCredentials: true,
        },
      );
      setUserData(res.data.rest);
      setAccessToken(res.data.accessToken);
      sessionStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userData", JSON.stringify(res.data.rest));
      setIsLoading(false);
      setLoginStage("success");
    } catch (err) {
      setLoginStage("failed");
      console.log(err);
      setIsLoading(false);
    }
  };

  const SignUpHandler = async (signUpData: SignUpDatatype) => {
    try {
      setIsLoading(true);

      const res = await axios.post(
        "http://localhost:2404/api/signup",
        signUpData,
      );

      setUserData(res.data.rest);
      setAccessToken(res.data.accessToken);
      sessionStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userData", JSON.stringify(res.data.rest));
      toast.success("SignUp Successfull");

      const emailRes = await axios.post(
        "http://localhost:2404/api/send-email",
        {
          email: signUpData.email,
          name: signUpData.name,
          templateId: 1,
          params: { name: signUpData.name },
        },
      );
      console.log("Email sent successfully:", emailRes.data);
      return res;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        userData,
        LoginHandler,
        isLoading,
        isDisable,
        accessToken,
        SignUpHandler,
        loginStage,
        TwoFaLoginHandler,
        setLoginStage,
        setUserData,
      }}
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
