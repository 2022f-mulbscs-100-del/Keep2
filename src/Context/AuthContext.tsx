import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

import type {
  LoginDatatype,
  SignUpDatatype,
  UserDataType,
  ErrorType,
} from "../types/Auth.types";

type AuthContextType = {
  userData: UserDataType | null;
  isLoading: boolean;
  LoginHandler: (loginData: LoginDatatype) => void;
  isDisable: boolean;
  accessToken: string | null;
  //eslint-disable-next-line
  SignUpHandler: (signUpData: SignUpDatatype) => Promise<UserDataType | any>;
  loginStage: string;
  TwoFaLoginHandler: (loginData: LoginDatatype, twoFaCode: string) => void;
  setLoginStage: (stage: string) => void;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  setSignUpStage: (stage: string) => void;
  signUpStage: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  SignUpConfirmation: (
    email: string,
    verificationCode: string,
  ) => Promise<void>;
  MFACodeVerification: (email: string, mfaCode: string) => Promise<void>;
  error: ErrorType;
  // ResetErrors: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType>({
    loginError: null,
    MFAError: null,
    twoFaError: null,
    signUpConfirmationError: null,
    signUpError: null,
    // refreshError: null,
  });
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loginStage, setLoginStage] = useState("login");
  const [signUpStage, setSignUpStage] = useState("signUp");
  const isDisable = userData === null;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/refresh`, {
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
        setError({
          ...error,
          refreshError: err.response?.data?.message || "Error refreshing token",
        });
        setUserData(null);
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        setIsLoading(false);
      });
  }, []);

  // const ResetErrors = () => {
  //   setError({
  //     loginError: null,
  //     MFAError: null,
  //     twoFaError: null,
  //     signUpConfirmationError: null,
  //     signUpError: null,
  //     refreshError: null,
  //   });
  // }

  const LoginHandler = async (loginData: LoginDatatype) => {
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, loginData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "2FA enabled") {
          setLoginStage("2FA");
          setIsLoading(false);
          return;
        } else if (res.data.message === "verify email") {
          setLoginStage("verifyEmail");
          setIsLoading(false);
          return;
        } else if (res.data.message === "MFA enabled") {
          setLoginStage("MFA");
          setIsLoading(false);
          return;
        } else {
          setLoginStage("success");

          setUserData(res.data.rest);
          setAccessToken(res.data.accessToken);
          sessionStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("userData", JSON.stringify(res.data.rest));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError({
          ...error,
          loginError: err.response?.data?.message || "Login error",
        });
        setIsLoading(false);
      });

    // try {
    //   const response = await axios.post(
    //     "https://keep2-d798.onrender.com/api/send-email",
    //     {
    //       email: loginData.email,
    //       name: ExtractName(loginData.email),
    //       templateId: 1,
    //       params: {
    //         name: ExtractName(loginData.email),
    //       },
    //     },
    //   );

    // } catch (error) {
    //   console.error(error);
    // }
  };

  const MFACodeVerification = async (email: string, mfaCode: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login-verify-mfa`,
        {
          email,
          token: mfaCode,
        },
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
      //eslint-disable-next-line
    } catch (err: any) {
      setLoginStage("failed");
      setError({
        ...error,
        MFAError: err.response?.data?.message || "MFA Verification error",
      });
      setIsLoading(false);
    }
  };
  const SignUpConfirmation = async (
    email: string,
    verificationCode: string,
  ) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signUpConfirmation`,
        {
          email,
          code: verificationCode,
        },
      );
      setLoginStage("success");
      setUserData(res.data.rest);
      setAccessToken(res.data.accessToken);
      sessionStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userData", JSON.stringify(res.data.rest));
      setIsLoading(false);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/send-email`, {
        email: email,
        name: res.data.rest?.name,
        templateId: 1,
        params: { name: res.data.rest?.name },
      });

      //eslint-disable-next-line
    } catch (err: any) {
      setIsLoading(false);
      setLoginStage("Invalid verification code");
      setError({
        ...error,
        signUpConfirmationError:
          err.response?.data?.message || "Error during sign up confirmation",
      });
    }
  };

  const TwoFaLoginHandler = async (
    loginData: LoginDatatype,
    twoFaCode: string,
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/2fa-login`,
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
      //eslint-disable-next-line
    } catch (err: any) {
      setLoginStage("failed");
      setError({
        ...error,
        twoFaError: err.response?.data?.message || "2FA Login error",
      });
      setIsLoading(false);
    }
  };

  const SignUpHandler = async (signUpData: SignUpDatatype) => {
    try {
      setIsLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        signUpData,
      );
      if (res.data.message === "verify email") {
        setSignUpStage("verifyEmail");
        setIsLoading(false);
        return res;
      } else if (res.status === 201) {
        setSignUpStage("success");
        setUserData(res.data.rest);
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(res.data.rest));
        setIsLoading(false);

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/send-email`,
          {
            email: signUpData.email,
            name: signUpData.name,
            templateId: 1,
            params: { name: signUpData.name },
          },
        );
        return res;
      }
      //eslint-disable-next-line
    } catch (err: any) {
      setError({
        ...error,
        signUpError: err.response?.data?.message || "Error during sign up",
      });
      setIsLoading(false);
      throw err;
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
        setSignUpStage,
        signUpStage,
        setAccessToken,
        SignUpConfirmation,
        MFACodeVerification,
        error,
        setError,
        // ResetErrors,
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
