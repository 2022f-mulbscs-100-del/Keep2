import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TwoFABlock = () => {
  const {
    UpdateUserProfile,
    profileData,
    error: profileError,
    setError,
  } = useUser();
  const [enable2FA, setEnable2FA] = useState(false);

  useEffect(() => {
    if (profileData?.isTwoFaEnabled === true) {
      setEnable2FA(true);
    } else {
      setEnable2FA(false);
    }
  }, [profileData]);

  const handleEnable2FA = async () => {
    try {
      await UpdateUserProfile({
        isTwoFaEnabled: !enable2FA,
      });
    } catch (error) {
      toast.error("Error updating 2FA status: " + (error as Error).message);
    }
  };

  useEffect(() => {
    if (profileError) {
      toast.error(profileError.ProfileError);
    }
  }, [profileError]);

  useEffect(() => {
    return () => {
      setError!({ ...profileError, ProfileError: null });
    };
  }, []);
  return (
    <>
      <div className="mx-auto border border-[#525355] rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Add an extra layer of protection to your account by enabling
          two-factor authentication (2FA).
        </p>

        <button
          className="cursor-pointer hover:bg-[#52535596]  flex justify-center p-2 rounded-lg w-full"
          onClick={handleEnable2FA}
        >
          {enable2FA ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>
    </>
  );
};

export default TwoFABlock;
