import { IoTrashOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import axiosClient from "../../api/axiosClient";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../component/Buttons/PrimaryButton";

const DeleteAccount = () => {
  const { t } = useTranslation();
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
    if (!formData.password) {
      toast.error(t("errors.pleaseEnterPassword"));
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
        toast.error(
          error.response?.data?.message || t("errors.errorDeletingAccount"),
        );
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
      <SettingHeader title={t("account.deleteAccount")} />

      <div className="mx-auto border border-borderColor rounded-[10px] p-6">
        <div className="flex items-center gap-4 mb-4">
          <IoTrashOutline className="text-subheading2 text-red-400" />
          <h2 className="text-subheading2 font-semibold text-red-400">
            {t("account.deleteAccount")}
          </h2>
        </div>

        <p className="text-body text-gray-400 mb-6">
          {t("account.deleteAccountDescription")}
        </p>
        {stage === "accountDeleted" && (
          <div className="flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-borderColor mb-4">
            <input
              className="outline-none w-full"
              type={`${showPassword ? "text" : "password"}`}
              placeholder={t("auth.password")}
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

        <PrimaryButton
          title={
            !Loading
              ? stage === "deleteConfirmation"
                ? "Delete My Account"
                : t("account.deleteMyAccount")
              : t("account.deletingAccount")
          }
          onClick={
            stage === "deleteConfirmation"
              ? () => setStage("accountDeleted")
              : handleDelete
          }
          isLoading={Loading}
        />
      </div>
    </div>
  );
};

export default DeleteAccount;
