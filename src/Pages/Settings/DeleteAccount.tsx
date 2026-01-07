import { IoTrashOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import axiosClient from "../../api/axiosClient";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const DeleteAccount = () => {
  const [Loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState("deleteConfirmation");
  const [formData, setFormData] = useState({
    password: "",
  });

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleDelete = () => {
    if (formData.password === "") {
      toast.error("Please enter your password to delete account");
      return;
    }
    setLoading(true);
    axiosClient
      .delete("/deleteProfile", {
        data: {
          password: formData.password,
        },
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("accessToken");
        setLoading(false);
        window.location.href = "/login";
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.message || "Error deleting account");
      });
  };

  const HandleLoginFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title="Delete Account" />

      <div className="mx-auto border border-[#525355] rounded-[10px] p-6">
        <div className="flex items-center gap-4 mb-4">
          <IoTrashOutline className="text-2xl text-red-400" />
          <h2 className="text-xl font-semibold text-red-400">Delete Account</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        {stage === "accountDeleted" && (
          <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] mb-4">
            <input
              className="outline-none w-full"
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Password"
              name="password"
              onChange={HandleLoginFormData}
              value={formData.password}
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
        )}

        <div
          onClick={
            stage === "deleteConfirmation"
              ? () => setStage("accountDeleted")
              : handleDelete
          }
          className="hover:bg-red-500/10 cursor-pointer flex justify-center p-2 rounded-lg"
        >
          <button className="cursor-pointer text-red-400" disabled={Loading}>
            {!Loading
              ? stage === "deleteConfirmation"
                ? "Delete My Account"
                : "Confirm Account Deletion"
              : "Deleting Account..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
