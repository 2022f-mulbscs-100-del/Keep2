import { useEffect, useState } from "react";
import { IoTimerOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { toast } from "react-toastify";
const AutoLogoutBlock = () => {
  const {
    UpdateUserProfile,
    profileData,
    error: profileError,
    setError,
  } = useUser();

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

  useEffect(() => {
    return () => {
      setError!({ ...profileError, ProfileError: null });
    };
  }, []);

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
    if (profileError) {
      toast.error(profileError.ProfileError);
    }
  }, [profileError]);
  return (
    <>
      <div className="border border-borderColor rounded-[10px] p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <IoTimerOutline className="text-subheading2 text-gray-400 mt-1" />
            <h2 className="text-subheading2 font-semibold mb-1">Auto Logout</h2>
          </div>
          <p className="text-body text-gray-400 ">
            Automatically sign out after a period of inactivity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-4 min-w-[250px]  px-4  py-2 rounded-[8px]  border border-borderColor ${autoLogout === false ? "bg-[#36363898] cursor-not-allowed" : "bg-transparent"} `}
          >
            <input
              className={` outline-none  text-body2 w-full text-white ${autoLogout === false ? " cursor-not-allowed" : ""}`}
              type="number"
              placeholder="Enter value in minutes"
              name="value"
              value={autoLogoutTime || ""}
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
              autoLogout ? "bg-primary" : "bg-gray-500"
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
