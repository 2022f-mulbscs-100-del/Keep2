import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { LoginHandler, isLoading } = useUser();
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const HandleLoginFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
    console.log(loginData);
  };
  const HandleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    LoginHandler(loginData);
    toast.success("login successfull");
    navigate("/");
  };
  return (
    <>
      <form
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

          <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg">
            <button
              disabled={isLoading}
              className="cursor-pointer"
              type="submit"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
