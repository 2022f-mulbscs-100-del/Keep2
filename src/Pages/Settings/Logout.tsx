import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="m-auto w-full p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Security Settings</h1>

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
