import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("accessToken");
    navigate("/login");

    axios
      .get("http://localhost:2404/api/logout", { withCredentials: true })
      .then((response) => {
        console.log("Logged out from server:", response.data);
      })
      .catch((error) => {
        console.error("Error logging out from server:", error);
      });
  };

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
          <button className="cursor-pointer">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
