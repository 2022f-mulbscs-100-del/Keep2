import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";

const TwoFABlock = () => {
  const {
    UpdateUserProfile,
    profileData,
    error: profileError,
    setError,
  } = useUser();
  const [enable2FA, setEnable2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profileData?.isTwoFaEnabled === true) {
      setEnable2FA(true);
    } else {
      setEnable2FA(false);
    }
  }, [profileData]);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      await UpdateUserProfile({
        isTwoFaEnabled: !enable2FA,
      });
      setIsLoading(false);
      toast.success("Two FA activated");
    } catch (error) {
      setIsLoading(false);
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
      <div className="mx-auto border border-borderColor rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-subheading2 text-gray-400" />
          <h2 className="text-subheading2 font-semibold">
            Two-Factor Authentication
          </h2>
        </div>

        <p className="text-body text-gray-400 mb-6">
          Add an extra layer of protection to your account by enabling
          two-factor authentication (2FA).
        </p>

        <PrimaryButton
          title={enable2FA ? "Disable 2FA" : "Enable 2FA"}
          onClick={handleEnable2FA}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default TwoFABlock;
