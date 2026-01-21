import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { Logger } from "../../../utils/Logger";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import { MFAcodeValidation } from "../../../validation/validation";
import { z } from "zod";
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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (profileData?.MfaEnabled === true) {
      setEnableMFA(true);
      setQrCode("");
    } else {
      setEnableMFA(false);
    }
  }, [profileData]);

  const handleMFA = () => {
    setIsLoading(true);
    axiosClient
      .post("/MFA-generate", { email: profileData?.email })
      .then((response) => {
        setQrCode(response.data.qrCode);
        setIsLoading(false);
      })
      .catch((error) => {
        Logger("Error generating MFA QR code:", error);
        setIsLoading(false);
      });
  };

  const CodeVerification = () => {
    if (MFAcode.length !== 6) {
      Logger("MFA code must be 6 digits long");
      return;
    }

    try {
      setIsLoading(true);
      MFAcodeValidation.parse({ mfaCode: MFAcode });
      axiosClient
        .post("/verify-mfa", {
          email: profileData?.email,
          token: MFAcode,
        })
        .then(() => {
          setIsLoading(false);
          setEnableMFA(true);
          fetchUserProfile();
        })
        .catch((error) => {
          setIsLoading(false);
          Logger("Error verifying MFA code:", error);
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message).join(", ");
        toast.error(messages);
        Logger("Validation Error:", messages);
      }
      setIsLoading(false);
    }
  };

  const HandleDisableMFa = async () => {
    setIsLoading(true);
    try {
      await UpdateUserProfile({
        MfaEnabled: false,
      });
      setIsLoading(false);
      setQrCode("");
      setEnableMFA(false);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Error disabling MFA");
      setIsLoading(false);
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

        <PrimaryButton
          title={enableMFA ? "Disable MFA" : "Enable MFA"}
          onClick={
            enableMFA ? HandleDisableMFa : qrCode ? CodeVerification : handleMFA
          }
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default MFABlock;
