import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Logger } from "../../utils/Logger";
import PrimaryButton from "../../component/Buttons/PrimaryButton";

function ForgetPassword() {
  const [stage, setStage] = useState("codeToEmail");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    inputRef?.current?.focus();
  }, [stage]);
  const handlePasswordToggle = (id: number) => {
    if (id === 1) {
      setShowPassword(!showPassword);
    }
    if (id === 2) {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const codeCheck = () => {
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/code-check`, {
        email,
        code,
      })
      .then(() => {
        setIsLoading(false);
        setStage("forgetPassword");
      })
      .catch((error) => {
        setIsLoading(false);
        Logger("There was an error!", error);
      });
  };

  const forgetPassword = () => {
    if (email === "") {
      return;
    }
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/forget-password-token`, {
        email,
      })
      .then(() => {
        setIsLoading(false);
        toast.success("Code sent to your email");
        setStage("codeConfirmation");
      })
      .catch((error) => {
        setIsLoading(false);
        Logger("There was an error!", error);
      });
  };

  const resetPassword = () => {
    if (password === "" || confirmPassword === "") {
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be same");
      return;
    }
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
        email,
        code,
        password,
        resetThroughToken: true,
      })
      .then(() => {
        setIsLoading(false);
        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        Logger("There was an error!", error);
        setIsLoading(false);
      });
  };

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  return (
    <>
      {stage === "codeToEmail" && (
        <div className="flex justify-center items-center h-full mt-10">
          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-2xl">Forget Password</h1>
              <p className="opacity-50">
                Enter your email we will send code to reset password
              </p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                <input
                  ref={inputRef}
                  className="outline-none w-full"
                  type="text"
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
            </div>

            <PrimaryButton
              title={isLoading ? "Loading..." : "Send Code"}
              onClick={forgetPassword}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      {stage === "codeConfirmation" && (
        <div className="flex justify-center items-center h-full mt-10">
          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-subheading2">Forget Password</h1>
              <p className="text-body2">Check your email for code</p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                <input
                  ref={inputRef}
                  className="outline-none w-full text-body2"
                  type="text"
                  placeholder="Enter the code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <PrimaryButton
              title={isLoading ? "Loading..." : "Continue"}
              onClick={codeCheck}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {stage === "forgetPassword" && (
        <div className="flex justify-center items-center h-full mt-10">
          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-subheading2">Forget Password</h1>
              <p className="text-body2">Check your email for code</p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                <input
                  ref={inputRef}
                  className="outline-none w-full text-body2"
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="Enter your new password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
              <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                <input
                  className="outline-none w-full text-body2"
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  placeholder="Conifrm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
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
            </div>

            <PrimaryButton
              title={isLoading ? "Loading..." : "Continue"}
              onClick={resetPassword}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ForgetPassword;
