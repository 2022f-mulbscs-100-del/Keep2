import { IoExitOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Logger } from "../../utils/Logger";

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    setIsLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
        withCredentials: true,
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
        // setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        Logger("Error logging out from server",error)
        setError(`Error logging out from server: ${error.message}`);
      });
  };

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title="Logout Settings" />

      <div className="mx-auto border border-[#525355] rounded-[10px] p-6">
        <div className="flex items-center gap-4 mb-4">
          <IoExitOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">Logout</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Signing out will end your current session. You’ll need to log in again
          to access your account.
        </p>

        <div
          onClick={handleLogout}
          className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg"
        >
          <button className="cursor-pointer" disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
