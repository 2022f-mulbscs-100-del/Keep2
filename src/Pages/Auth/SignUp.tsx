import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import TurnstileWidget from "../../component/turnstile/Turnstile";
import axios from "axios";
import { Logger } from "../../utils/Logger";
import PrimaryButton from "../../component/Buttons/PrimaryButton";
import SocialLoginButton from "./SocialLoginButton";
import { FcGoogle } from "react-icons/fc";
import { LiaGithub } from "react-icons/lia";

function SignUp() {
  const { t } = useTranslation();
  const {
    SignUpHandler,
    isLoading,
    signUpStage,
    error,
    setError,
    SignUpConfirmation,
  } = useAuth();
  const [stage, setStage] = useState("signUp");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [SignUpCode, setSignUpCode] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handlePasswordToggle = (id: number) => {
    if (id === 1) {
      setShowPassword(!showPassword);
    }
    if (id === 2) {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (error.signUpError) {
      toast.error(error.signUpError);
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
    if (stage === "verifyEmail") {
      if (signUpStage === "success") {
        toast.success(t("success.signupSuccessful"));
      }
    }
  }, [signUpStage]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [signUpStage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSignUpForm({
      ...signUpForm,
      [name]: value,
    });
  };

  const SignUpHandleFunction = async () => {
    if (!token) {
      toast.error(t("errors.completeCaptcha"));
      return;
    }
    if (!turnstileVerified) {
      toast.error(t("errors.captchaVerificationFailed"));
      return;
    }
    if (
      signUpForm.name === "" &&
      signUpForm.email === "" &&
      signUpForm.password === "" &&
      signUpForm.confirmPassword === ""
    ) {
      toast.error(t("errors.fillAllFields"));
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error(t("errors.passwordMustBeSame"));
      return;
    }
    const signupFormData = {
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
    };

    if (!token) {
      toast.error(t("errors.pleaseCompleteCaptcha"));
      return;
    }

    try {
      await SignUpHandler(signupFormData);
      setStage("verifyEmail");
    } catch (error) {
      Logger("Error during signup:", error);
      toast.error(t("errors.signupFailed"));
    }
  };

  const HandleEmailVerifaction = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (SignUpCode === "") {
      toast.error(t("errors.enter2FACode"));
      return;
    }

    try {
      await SignUpConfirmation(signUpForm.email, SignUpCode);
      toast.success(t("success.emailVerifiedSuccessfully"));
      navigate("/");
    } catch (error) {
      toast.error(t("errors.invalidVerificationCode"));
      Logger("Error during email verification:", error);
    }
  };

  const handleVerify = (token: string) => {
    setToken(token);

    if (token) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/turnstile-verify`, {
          token,
        })
        .then(() => {
          setTurnstileVerified(true);
          toast.success(t("success.captchaVerifiedSuccessfully"));
        })
        .catch((error) => {
          Logger("CAPTCHA verification failed:", error);
          setTurnstileVerified(false);
          toast.error(t("errors.captchaVerificationFailed2"));
        });
    }
  };

  useEffect(() => {
    if (formRef.current === null) {
      return;
    }

    if (
      !isLoading &&
      formRef.current &&
      stage === "verifyEmail" &&
      SignUpCode.length === 6
    ) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  }, [SignUpCode]);

  return (
    <>
      {stage === "signUp" && (
        <>
          <div className="flex justify-center items-center h-full mt-10">
            <form onSubmit={SignUpHandleFunction}>
              <div className="">
                <div className="flex flex-col items-center mb-4">
                  <h1 className="font-bold text-heading2">
                    {t("auth.signUp")}
                  </h1>
                  <p className="text-body2">{t("auth.toContinue")}</p>
                </div>
                <div className="flex items-center gap-4 mb-4 xsm:max-w-[300px]  sm:min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    ref={inputRef}
                    className="outline-none w-full text-body2"
                    type="text"
                    placeholder={t("auth.name")}
                    name="name"
                    value={signUpForm.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center mb-4 gap-4 xsm:max-w-[300px]  sm:min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    className="outline-none w-full text-body2"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={signUpForm.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4  px-4 xsm:max-w-[300px] sm:min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      className="outline-none w-full text-body2"
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder={t("auth.password")}
                      name="password"
                      value={signUpForm.password}
                      onChange={handleChange}
                    />

                    {!showPassword ? (
                      <FaRegEyeSlash
                        className="cursor-pointer"
                        onClick={() => handlePasswordToggle(1)}
                      />
                    ) : (
                      <FaRegEye
                        className="cursor-pointer"
                        onClick={() => handlePasswordToggle(1)}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-4  px-4 xsm:max-w-[300px] sm:min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor mt-4">
                    <input
                      className="outline-none w-full text-body2"
                      type={`${showConfirmPassword ? "text" : "password"}`}
                      placeholder={t("auth.confirmPassword")}
                      name="confirmPassword"
                      value={signUpForm.confirmPassword}
                      onChange={handleChange}
                    />

                    {!showConfirmPassword ? (
                      <FaRegEyeSlash
                        className="cursor-pointer"
                        onClick={() => handlePasswordToggle(2)}
                      />
                    ) : (
                      <FaRegEye
                        className="cursor-pointer"
                        onClick={() => handlePasswordToggle(2)}
                      />
                    )}
                  </div>
                  <div
                    className="text-[12px] ml-2 mt-2 cursor-pointer"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    {t("auth.alreadyHaveAccount")}
                  </div>
                </div>
                <div className="mt-2 ">
                  <TurnstileWidget onVerify={handleVerify} />
                </div>

                <PrimaryButton
                  title={isLoading ? t("auth.loading") : t("auth.signUp")}
                  onClick={SignUpHandleFunction}
                  isLoading={isLoading}
                />
              </div>
            </form>
          </div>
          <div className="xsm:w-full sm:w-[400px] mx-auto ">
            <div className="flex items-center justify-center gap-4">
              <div className="border border-t xsm:w-[50px]  sm:w-[100px] opacity-50" />
              <div className="text-center text-body2 ">
                {t("auth.orContinueWith")}
              </div>
              <div className="border border-t xsm:w-[50px]  sm:w-[100px] opacity-50" />
            </div>
            <div className="flex flex-col xsm:justify-center xsm:items-center ">
              <SocialLoginButton
                title={t("auth.loginWithGoogle")}
                url={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}
                provider="GoogleLogin"
                icon={<FcGoogle />}
              />
              <SocialLoginButton
                title={t("auth.loginWithGitHub")}
                url={`${import.meta.env.VITE_API_BASE_URL}/api/auth/github`}
                provider="GithubLogin"
                icon={<LiaGithub />}
              />
            </div>
          </div>
        </>
      )}

      {stage === "verifyEmail" && (
        <form ref={formRef} onSubmit={HandleEmailVerifaction}>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-subheading2">
                  {t("auth.emailVerification")}
                </h1>
                <p className="text-body2">{t("auth.enterVerificationCode")}</p>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    ref={inputRef}
                    className="outline-none w-full text-body2"
                    type="number"
                    placeholder={t("auth.enterVerificationCode")}
                    name="SignUpCode"
                    value={SignUpCode}
                    onChange={(e) => setSignUpCode(e.target.value)}
                  />
                </div>
              </div>

              <PrimaryButton
                title={isLoading ? t("auth.loading") : t("auth.verify")}
                isLoading={isLoading}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default SignUp;
