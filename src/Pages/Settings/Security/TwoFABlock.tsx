import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { useEffect, useState } from "react";

const TwoFABlock = () => {
  const { UpdateUserProfile, profileData } = useUser();
  const [enable2FA, setEnable2FA] = useState(false);

  useEffect(() => {
    if (profileData?.isTwoFaEnabled === true) {
      setEnable2FA(true);
    } else {
      setEnable2FA(false);
    }
  }, [profileData]);

  const handleEnable2FA = () => {
    // Logic to enable 2FA goes here
    UpdateUserProfile({
      name: "",
      email: "",
      profileImage: "",
      phone: null,
      isTwoFaEnabled: !enable2FA,
    });
    console.log("Enable 2FA clicked");
  };

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

        <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg">
          <button className="cursor-pointer" onClick={handleEnable2FA}>
            {enable2FA ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TwoFABlock;
