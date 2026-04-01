import { useEffect, useMemo, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify"
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import PrimaryButton from "../../component/Buttons/PrimaryButton";
import SocialLoginButton from "./SocialLoginButton";
import { FcGoogle } from "react-icons/fc";
import { LiaGithub } from "react-icons/lia";
import AuthenticationOptions from "./AuthenticationOptions";

function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [TwoFa, setTwoFa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerifcation, setEmailVerification] = useState(false);
  const [MFAcode, setMFAcode] = useState("");
  const [MFA, setMFA] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const callbackRedirect = useMemo(() => {
    const redirect = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    if (!redirect || !redirect.startsWith("http://localhost:")) {
      return null;
    }
    return redirect;
  }, []);

  const {
    LoginHandler,
    isLoading,
    loginStage,
    TwoFaLoginHandler,
    setLoginStage,
    SignUpConfirmation,
    MFACodeVerification,
    error,
    setError,
  } = useAuth();

  const redirectToCallbackWithTokens = () => {
    if (!callbackRedirect) return false;

    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      return false;
    }

    const callbackUrl = new URL(callbackRedirect);
    callbackUrl.searchParams.set("accessToken", accessToken);
    callbackUrl.searchParams.set("refreshToken", refreshToken);
    window.location.href = callbackUrl.toString();
    return true;
  };

  useEffect(() => {
    if (formRef.current === null) {
      return;
    }
    if (MFAcode.length === 6 && !isLoading && formRef.current) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          );
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (twoFaCode.length === 6 && !isLoading && formRef.current) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          );
        }
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (verificationCode.length === 6 && !isLoading && formRef.current) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          );
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [MFAcode, twoFaCode, verificationCode]);

  useEffect(() => {
    if (!TwoFa) {
      if (loginStage === "success") {
        toast.success(t("success.loginSuccessful"));
        if (!redirectToCallbackWithTokens()) {
          navigate("/");
        }
        setLoginStage("login");
      }

      if (loginStage === "failed") {
        toast.error(t("errors.invalidCredentials"));
        setLoginStage("login");
      }

      if (loginStage === "2FA") {
        setTwoFa(true);
      }
      if (loginStage === "verifyEmail") {
        setEmailVerification(true);
      }
      if (loginStage === "MFA") {
        setMFA(true);
      }
    }
  }, [loginStage]);

  useEffect(() => {
    if (TwoFa) {
      if (loginStage === "success") {
        toast.success(t("success.loginSuccessful"));
        if (!redirectToCallbackWithTokens()) {
          navigate("/");
        }
        setLoginStage("login");
      } else if (loginStage === "failed") {
        toast.error(t("errors.invalid2FACode"));
      } else if (loginStage === "Invalid verification code") {
        toast.error(t("errors.invalidVerificationCode"));
      }
    }
  }, [loginStage]);

  useEffect(() => {
    if (error.MFAError) {
      toast.error(typeof error === "string" ? error : error.MFAError);
    }
    if (error.twoFaError) {
      toast.error(typeof error === "string" ? error : error.twoFaError);
    }
    if (error.signUpConfirmationError) {
      toast.error(
        typeof error === "string" ? error : error.signUpConfirmationError,
      );
    }
    if (error.loginError) {
      toast.error(typeof error === "string" ? error : error.loginError);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      setError({
        loginError: null,
        MFAError: null,
        twoFaError: null,
        signUpConfirmationError: null,
        signUpError: null,
        refreshError: null,
      });
    };
  }, []);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [loginStage, TwoFa]);

  const Handle2FASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    TwoFaLoginHandler(loginData, twoFaCode);
  };
  const HandleEmailVerification = (e: React.FormEvent<HTMLFormElement>) => {
    if (!emailVerifcation) {
      return;
    }
    if (verificationCode.length === 0) {
      toast.error(t("errors.pleaseEnterVerificationCode"));
      return;
    }
    e.preventDefault();
    SignUpConfirmation(loginData.email, verificationCode);
  };
  const HandleMFAVerification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    MFACodeVerification(loginData.email, MFAcode);
  };
  const HandleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    LoginHandler(loginData);
  };
  const HandleLoginFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {!TwoFa && !emailVerifcation && !MFA && (
        <div className="flex flex-col">
          <form
            ref={formRef}
            onSubmit={HandleLogin}
            className="flex justify-center items-center h-full mt-20"
          >
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-subheading2">
                  {t("auth.login")}
                </h1>
                <p className="text-body2">{t("auth.toContinue")}</p>
              </div>
              <div className="flex justify-end text-[12px] mr-2 mb-2 ">
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  {t("auth.signUp")}
                </button>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    ref={inputRef}
                    className="outline-none w-full text-body2"
                    type="text"
                    placeholder={t("auth.email")}
                    name="email"
                    onChange={HandleLoginFormData}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      className="outline-none w-full text-body2"
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder={t("auth.password")}
                      name="password"
                      onChange={HandleLoginFormData}
                    />

                    {!showPassword ? (
                      <FaRegEyeSlash
                        className="cursor-pointer"
                        onClick={handlePasswordToggle}
                      />
                    ) : (
                      <FaRegEye
                        className="cursor-pointer"
                        onClick={handlePasswordToggle}
                      />
                    )}
                  </div>
                  <div
                    className="text-[12px] ml-2 mt-2 cursor-pointer"
                    onClick={() => {
                      navigate("/forget-password");
                    }}
                  >
                    {t("auth.forgetPassword")}
                  </div>
                </div>
              </div>

              <PrimaryButton
                title={isLoading ? t("auth.login") : "Login"}
                isLoading={isLoading}
              />
            </div>
          </form>
          <div className="w-[400px] mx-auto ">
            <div className="flex items-center justify-center gap-4">
              <div className="border border-t w-[100px] opacity-50" />
              <div className="text-center text-body2 ">
                {t("auth.orContinueWith")}
              </div>
              <div className="border border-t w-[100px] opacity-50" />
            </div>
            <div className="flex flex-col ">
              <SocialLoginButton
                title={t("auth.loginWithGoogle")}
                url={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google${callbackRedirect ? `?redirect=${encodeURIComponent(callbackRedirect)}` : ""}`}
                provider="GoogleLogin"
                icon={<FcGoogle />}
              />
              <SocialLoginButton
                title={t("auth.loginWithGitHub")}
                url={`${import.meta.env.VITE_API_BASE_URL}/api/auth/github${callbackRedirect ? `?redirect=${encodeURIComponent(callbackRedirect)}` : ""}`}
                provider="GithubLogin"
                icon={<LiaGithub />}
              />
            </div>
          </div>
        </div>
      )}

      {TwoFa && (
        <>
          <form ref={formRef} onSubmit={Handle2FASubmit}>
            <div className="flex justify-center items-center h-full mt-10">
              <div className="">
                <div className="flex flex-col items-center mb-4">
                  <h1 className="font-bold text-subheading2">
                    {t("security.twoFactorAuthentication")}
                  </h1>
                  <p className="text-body2">{t("auth.enter2FACode")}</p>
                </div>
                <div className="flex flex-col gap-4 ">
                  <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      ref={inputRef}
                      className="outline-none w-full text-body2"
                      type="number"
                      placeholder={t("auth.enter2FACode")}
                      name="2faCode"
                      value={twoFaCode}
                      onChange={(e) => setTwoFaCode(e.target.value)}
                    />
                  </div>
                </div>

                <PrimaryButton
                  title={isLoading ? "Loading..." : t("auth.verify")}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </form>
          <div className="flex justify-center">
            <AuthenticationOptions
              option1="Authenticator App"
              option2="Pass Key"
            />
          </div>
        </>
      )}

      {emailVerifcation && (
        <>
          <form ref={formRef} onSubmit={HandleEmailVerification}>
            <div className="flex justify-center items-center h-full mt-10">
              <div className="">
                <div className="flex flex-col items-center mb-4">
                  <h1 className="font-bold text-subheading2">
                    {t("auth.emailVerification")}
                  </h1>
                  <p className="text-body2">
                    {t("auth.enterVerificationCode")}
                  </p>
                </div>
                <div className="flex flex-col gap-4 ">
                  <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      ref={inputRef}
                      className="outline-none w-full text-body2"
                      type="number"
                      placeholder={t("auth.enterVerificationCode")}
                      name="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                </div>

                <PrimaryButton
                  title={isLoading ? "Loading..." : t("auth.verify")}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </form>
        </>
      )}

      {MFA && (
        <>
          <form ref={formRef} onSubmit={HandleMFAVerification}>
            <div className="flex justify-center items-center h-full mt-10">
              <div className="">
                <div className="flex flex-col items-center mb-4">
                  <h1 className="font-bold text-subheading2">
                    {t("auth.mfaVerification")}
                  </h1>
                  <p className="text-body2">{t("auth.enterMFACode")}</p>
                </div>
                <div className="flex flex-col gap-4 ">
                  <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      ref={inputRef}
                      className="outline-none w-full text-body2"
                      type="number"
                      placeholder={t("auth.enterMFACode")}
                      name="mfaCode"
                      value={MFAcode}
                      onChange={(e) => setMFAcode(e.target.value)}
                    />
                  </div>
                </div>

                <PrimaryButton
                  title={isLoading ? "Loading..." : t("auth.verify")}
                  isLoading={isLoading}
                />

                {/* <button
                type="submit"
                disabled={isLoading}
                className="hover:bg-secondary mt-4 cursor-pointer flex justify-center p-2 mt-  4 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-60
  "
              >
                {isLoading ? "Loading..." : "Verify"}
              </button> */}
              </div>
            </div>
          </form>
          <div className="flex justify-center">
            <AuthenticationOptions option1="Email" option2="Pass Key" />
          </div>
        </>
      )}
    </>
  );
}

export default Login;
