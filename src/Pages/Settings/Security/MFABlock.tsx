import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { Logger } from "../../../utils/Logger";

const MFABlock = () => {
  const {
    profileData,
    UpdateUserProfile,
    fetchUserProfile,
    error: userError,
    setError,
  } = useUser();
  const [enableMFA, setEnableMFA] = useState(false);
  const [MFAcode, setMFAcode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (profileData?.MfaEnabled === true) {
      setEnableMFA(true);
      setQrCode("");
    } else {
      setEnableMFA(false);
    }
  }, [profileData]);

  const handleMFA = () => {
    axiosClient
      .post("/MFA-generate", { email: profileData?.email })
      .then((response) => {
        setQrCode(response.data.qrCode);
      })
      .catch((error) => {
      Logger("Error generating MFA QR code:", error);
      });
  };

  const CodeVerification = () => {
    if (MFAcode.length !== 6) {
    Logger("MFA code must be 6 digits long");
      return;
    }
    axiosClient
      .post("/verify-mfa", {
        email: profileData?.email,
        token: MFAcode,
      })
      .then(() => {
        setEnableMFA(true);
        fetchUserProfile();
      })
      .catch((error) => {
        Logger("Error verifying MFA code:", error);
      });
  };

  const HandleDisableMFa = async () => {
    try {
      await UpdateUserProfile({
        MfaEnabled: false,
      });
      setQrCode("");
      setEnableMFA(false);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Error disabling MFA");
    }
  };

  useEffect(() => {
    if (formRef.current === null) {
      return;
    }
    if (formRef.current && MFAcode.length === 6) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          );
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [MFAcode]);

  useEffect(() => {
    if (!userError?.ProfileError) return;
    toast.error(userError.ProfileError || "An error occurred");
  }, [userError]);

  useEffect(() => {
    return () => {
      setError!({ ...userError, ProfileError: null });
    };
  }, []);
  return (
    <>
      <div className="mx-auto border border-borderColor rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-subheading2 text-gray-400" />
          <h2 className="text-subheading2 font-semibold">
            Multi-Factor Authentication{" "}
          </h2>
        </div>

        <p className="text-body text-gray-400 mb-6">
          Add an extra layer of protection to your account by enabling
          Multi-Factor Authentication (MFA).
        </p>
        <div className="flex justify-center items-center flex-col gap-4 mb-4">
          {qrCode && (
            <>
              <img src={qrCode} alt="MFA QR Code" />
              <form ref={formRef} onSubmit={CodeVerification}>
                <div className="flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
                  <input
                    className="outline-none w-full  text-body2"
                    type="number"
                    placeholder="Enter MFA Code"
                    name="mfaCode"
                    value={MFAcode}
                    onChange={(e) => setMFAcode(e.target.value)}
                  />
                </div>
              </form>
            </>
          )}
        </div>
        <button
          className="cursor-pointer hover:bg-[#52535596]  flex justify-center p-2 rounded-lg w-full text-body"
          onClick={
            enableMFA ? HandleDisableMFa : qrCode ? CodeVerification : handleMFA
          }
        >
          {enableMFA ? "Disable MFA" : "Enable MFA"}
        </button>
      </div>
    </>
  );
};

export default MFABlock;
