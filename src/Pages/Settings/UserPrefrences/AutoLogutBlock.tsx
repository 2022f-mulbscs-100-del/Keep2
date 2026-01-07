import { useEffect, useState } from "react";
import { IoTimerOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { toast } from "react-toastify";

const AutoLogoutBlock = () => {
  const { UpdateUserProfile, profileData, error } = useUser();

  const [autoLogout, setAutoLogout] = useState(
    profileData?.autoLogoutEnabled || false,
  );
  const [autoLogoutTime, setAutoLogoutTime] = useState(
    profileData?.autoLogoutTime,
  );

  useEffect(() => {
    if (profileData?.autoLogoutEnabled === true) {
      setAutoLogout(true);
    } else {
      setAutoLogout(false);
    }
  }, [profileData]);

  const handleEnableAutoLogout = async () => {
    try {
      await UpdateUserProfile({
        autoLogoutEnabled: !autoLogout,
      });
      setAutoLogout(!autoLogout);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Error updating auto logout status");
    }
  };

  const HandlerAutoLogoutTime = async () => {
    if (autoLogoutTime === profileData?.autoLogoutTime) return;
    try {
      await UpdateUserProfile({
        autoLogoutTime: autoLogoutTime,
      });
      toast.success(`Auto logout time updated to ${autoLogoutTime} minutes`);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Error updating auto logout time");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);
  return (
    <>
      <div className="border border-[#525355] rounded-[10px] p-6 flex items-center justify-between">
        <div>
          <div className="flex items-start gap-4">
            <IoTimerOutline className="text-2xl text-gray-400 mt-1" />
            <h2 className="text-xl font-semibold mb-1">Auto Logout</h2>
          </div>
          <p className="text-sm text-gray-400 ">
            Automatically sign out after a period of inactivity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-4 min-w-[250px]  px-4  py-2 rounded-[8px]  border border-[#525355] ${autoLogout === false ? "bg-[#36363898] cursor-not-allowed" : "bg-transparent"} `}
          >
            <input
              className={` outline-none w-full text-white ${autoLogout === false ? " cursor-not-allowed" : ""}`}
              type="number"
              placeholder="Enter value in minutes"
              name="value"
              value={autoLogoutTime}
              disabled={autoLogout === false}
              onChange={(e) => setAutoLogoutTime(Number(e.target.value))}
              onBlur={HandlerAutoLogoutTime}
              min={0}
              max={100}
            />
          </div>
          <button
            onClick={handleEnableAutoLogout}
            className={`relative w-12 h-6 rounded-full transition cursor-pointer ${
              autoLogout ? "bg-[#41331C]" : "bg-gray-500"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                autoLogout ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default AutoLogoutBlock;
