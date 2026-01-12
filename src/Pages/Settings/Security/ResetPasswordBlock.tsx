import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import { useUser } from "../../../Context/UserContext";

const ResetPasswordBlock = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(true);

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const { profileData, setError, error: profileError } = useUser();

  useEffect(() => {
    return () => {
      setError!({ ...profileError, ProfileError: null });
    };
  }, []);

  const handlePasswordToggle = (id: number) => {
    if (id === 1) {
      setShowPassword(!showPassword);
    }
    if (id === 2) {
      setShowConfirmPassword(!showConfirmPassword);
    }
    if (id === 3) {
      setCurrentPassword(!currentPassword);
    }
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetPassword = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.currentPassword === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    axiosClient
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
        currentPassword: formData.currentPassword,
        resetThroughToken: false,
        password: formData.password,
        email: profileData?.email,
      })
      .then(() => {
        toast.success("Password Updated");
        setFormData({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch(() => {
        setFormData({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      });
  };

  //   {
  //     "email":"zohaib24a@gmail.com",
  //     "currentPassword":"zohaib",
  //     "resetThroughToken":false,
  //     "password":"Zabi@2404"
  // }

  return (
    <form onSubmit={resetPassword}>
      <div className="mx-auto border border-borderColor rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-subheading2 text-gray-400" />
          <h2 className="text-subheading2 font-semibold">Reset Password</h2>
        </div>

        <p className="text-body text-gray-400 mb-6">
          It's a good practice to change your password regularly to keep your
          account secure.
        </p>
        <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor mb-4 ">
          <input
            className="outline-none w-full  text-body2"
            type={`${currentPassword ? "text" : "password"}`}
            placeholder="Your Current Password"
            name="currentPassword"
            onChange={HandleChange}
          />

          {!currentPassword ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={() => handlePasswordToggle(3)}
            />
          ) : (
            <FaRegEye
              className="cursor-pointer"
              onClick={() => handlePasswordToggle(3)}
            />
          )}
        </div>
        <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor ">
          <input
            className="outline-none w-full text-body2"
            type={`${showPassword ? "text" : "password"}`}
            placeholder="Password"
            name="password"
            onChange={HandleChange}
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
            className="outline-none w-full  text-body2"
            type={`${showConfirmPassword ? "text" : "password"}`}
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={HandleChange}
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

        <button
          className=" hover:bg-[#52535596] text-body cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordBlock;
