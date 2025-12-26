import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import TurnstileWidget from "../../component/turnstile/Turnstile";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
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
      alert("Please complete the CAPTCHA");
      return;
    }
    console.log(signupFormData);
    try {
      await SignUpHandler(signupFormData);
      navigate("/");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error(error);
    }
  };

  const handleVerify = (token: string) => {
    setToken(token);
    console.log("Turnstile token:", token);
    if (token) {
      axios
        .post("http://localhost:2404/api/turnstile-verify", { token })
        .then((response) => {
          console.log("Turnstile verification response:", response.data);

          setTurnstileVerified(true);
          toast.success("CAPTCHA verified successfully");
        })
        .catch((error) => {
          console.error("Error verifying Turnstile token:", error);
          setTurnstileVerified(false);
          toast.error("CAPTCHA verification failed");
        });
    }
  };
  const { SignUpHandler } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center h-full mt-10">
        <div className="">
          <div className="flex flex-col items-center mb-4">
            <h1 className="font-bold text-2xl">Sign Up</h1>
            <p>to continue to Keeper</p>
          </div>

          <div className="flex flex-col gap-4 ">
            <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="text"
                placeholder="Name"
                name="name"
                value={signUpForm.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
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
              <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
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
              <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] mt-4">
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
            <button className="cursor-pointer">SignUp</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
