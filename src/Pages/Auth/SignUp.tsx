import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import TurnstileWidget from "../../component/turnstile/Turnstile";
import axios from "axios";
import { Logger } from "../../utils/Logger";

function SignUp() {
  const { SignUpHandler, isLoading, signUpStage, error, setError } = useAuth();
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
        toast.success("Signup successful");
        navigate("/");
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
      toast.error("complete the captcha");
      return;
    }
    if (!turnstileVerified) {
      toast.error("captcha verification failed");
      return;
    }
    if (
      signUpForm.name === "" &&
      signUpForm.email === "" &&
      signUpForm.password === "" &&
      signUpForm.confirmPassword === ""
    ) {
      toast.error("Fill all the fields");
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error("password must be same");
      return;
    }
    const signupFormData = {
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
    };

    if (!token) {
      toast.error("Please complete the CAPTCHA");
      return;
    }

    try {
      await SignUpHandler(signupFormData);
      setStage("verifyEmail");
    } catch (error) {
    Logger("Error during signup:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const HandleEmailVerifaction = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (SignUpCode === "") {
      toast.error("Enter the 2FA code");
      return;
    }
    try {
      const signUpData = {
        email: signUpForm.email,
        code: SignUpCode,
        name: signUpForm.name,
      };

      await SignUpHandler(signUpData);
      if (signUpStage === "success") {
        toast.success("Signup successful");
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid 2FA code. Please try again.");
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
          toast.success("CAPTCHA verified successfully");
        })
        .catch((error) => {
        Logger("CAPTCHA verification failed:", error);
          setTurnstileVerified(false);
          toast.error("CAPTCHA verification failed");
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
        <div className="flex justify-center items-center h-full mt-10">
          <form onSubmit={SignUpHandleFunction}>
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-2xl">Sign Up</h1>
                <p>to continue to Keeper</p>
              </div>

              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    ref={inputRef}
                    className="outline-none w-full"
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={signUpForm.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    className="outline-none w-full"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={signUpForm.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                    <input
                      className="outline-none w-full"
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder="Password"
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
                  <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor mt-4">
                    <input
                      className="outline-none w-full"
                      type={`${showConfirmPassword ? "text" : "password"}`}
                      placeholder="Confirm Password"
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
                    Already have account?
                  </div>
                </div>
              </div>
              <div className="mt-2 ">
                <TurnstileWidget onVerify={handleVerify} />
              </div>
              <div
                className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg"
                onClick={SignUpHandleFunction}
              >
                <button disabled={isLoading} className="cursor-pointer">
                  {isLoading ? "Loading..." : "SignUp"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {stage === "verifyEmail" && (
        <form ref={formRef} onSubmit={HandleEmailVerifaction}>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="">
              <div className="flex flex-col items-center mb-4">
                <h1 className="font-bold text-2xl">Email Verification</h1>
                <p>
                  Enter the verification code sent to your email to continue
                </p>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    ref={inputRef}
                    className="outline-none w-full"
                    type="number"
                    placeholder="Enter Security Code"
                    name="SignUpCode"
                    value={SignUpCode}
                    onChange={(e) => setSignUpCode(e.target.value)}
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

export default SignUp;
