import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [TwoFa, setTwoFa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerifcation, setEmailVerification] = useState(false);
  const [MFAcode, setMFAcode] = useState("");
  const [MFA, setMFA] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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
        toast.success("Login successful");
        navigate("/");
        setLoginStage("login");
      }

      if (loginStage === "failed") {
        toast.error("Invalid credentials. Please try again.");
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
        toast.success("login successfull");
        navigate("/");
        setLoginStage("login");
      } else if (loginStage === "failed") {
        toast.error("Invalid 2FA code. Please try again.");
      } else if (loginStage === "Invalid verification code") {
        toast.error("Invalid verification code. Please try again.");
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
  const Handle2FASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    TwoFaLoginHandler(loginData, twoFaCode);
  };
  const HandleEmailVerification = (e: React.FormEvent<HTMLFormElement>) => {
    if (!emailVerifcation) {
      return;
    }
    if (verificationCode.length === 0) {
      toast.error("Please enter the verification code.");
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
        <form
          ref={formRef}
          onSubmit={HandleLogin}
          className="flex justify-center items-center h-full mt-10"
        >
          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-2xl">Login In</h1>
              <p>to continue to Keeper</p>
            </div>
            <div className="flex justify-end text-[12px] mr-2 mb-2 ">
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Sign Up
              </button>
            </div>
            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
                <input
                  className="outline-none w-full"
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={HandleLoginFormData}
                />
              </div>

              <div>
                <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
                  <input
                    className="outline-none w-full"
                    type={`${showPassword ? "text" : "password"}`}
                    placeholder="Password"
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
                  Forget Password?
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-60
  "
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      )}

      {TwoFa && (
        <form ref={formRef} onSubmit={Handle2FASubmit}>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-2xl">
                  Two-Factor Authentication
                </h1>
                <p>Enter the 2FA code sent to your email to continue</p>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
                  <input
                    className="outline-none w-full"
                    type="number"
                    placeholder="Enter 2FA Code"
                    name="2faCode"
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hover:bg-[#52535596] mt-4 cursor-pointer flex justify-center p-2 mt-  4 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-60
  "
              >
                {isLoading ? "Loading..." : "Verify"}
              </button>
            </div>
          </div>
        </form>
      )}

      {emailVerifcation && (
        <form ref={formRef} onSubmit={HandleEmailVerification}>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-2xl">Email Verification</h1>
                <p>
                  Enter the verification code sent to your email to continue
                </p>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
                  <input
                    className="outline-none w-full"
                    type="number"
                    placeholder="Enter Verification Code"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hover:bg-[#52535596] mt-4 cursor-pointer flex justify-center p-2 mt-  4 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-60
  "
              >
                {isLoading ? "Loading..." : "Verify"}
              </button>
            </div>
          </div>
        </form>
      )}

      {MFA && (
        <form ref={formRef} onSubmit={HandleMFAVerification}>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-2xl">MFA Verification</h1>
                <p>Enter the MFA code to continue</p>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
                  <input
                    className="outline-none w-full"
                    type="number"
                    placeholder="Enter MFA Code"
                    name="mfaCode"
                    value={MFAcode}
                    onChange={(e) => setMFAcode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hover:bg-[#52535596] mt-4 cursor-pointer flex justify-center p-2 mt-  4 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-60
  "
              >
                {isLoading ? "Loading..." : "Verify"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Login;
