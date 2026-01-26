import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { Logger } from "../../../utils/Logger";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import { useUser } from "../../../Context/UserContext";
const PassKeyBlock = () => {
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //     if (profileData?.MfaEnabled === true) {
  //         setEnableMFA(true);
  //         setQrCode("");
  //     } else {
  //         setEnableMFA(false);
  //     }
  // }, [profileData]);

  const { UpdateUserProfile } = useUser();

  const HandlePasskey = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/passkey-registration", {});

      // Convert challenge from base64url string to Uint8Array
      const publicKey = response.data;

      if (!publicKey.challenge) {
        toast.error("Invalid publicKey: missing challenge.");
        return;
      }

      publicKey.challenge = Uint8Array.from(
        atob(publicKey.challenge.replace(/_/g, "/").replace(/-/g, "+")),
        (c) => c.charCodeAt(0),
      );

      // Convert user.id to Uint8Array (WebAuthn requires bytes)
      publicKey.user.id = Uint8Array.from(String(publicKey.user.id), (c) =>
        c.charCodeAt(0),
      );

      const credential = await navigator.credentials.create({ publicKey });
      console.log("Credential created:", credential);
      await axiosClient.post("/passkey-verification", {
        attestationResponse: credential,
      });

      toast.success("Pass Key setup successfully!");
      await UpdateUserProfile({ passKeyEnabled: true });
    } catch (error) {
      Logger("Passkey error:", error);
      toast.error("Error creating/verifying Pass Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto border border-borderColor rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-subheading2 text-gray-400" />
          <h2 className="text-subheading2 font-semibold">Pass Key </h2>
        </div>

        <p className="text-body text-gray-400 mb-6">
          Add an extra layer of protection to your account by enabling Pass Key.
        </p>

        <PrimaryButton
          title={"setup Pass Key"}
          onClick={HandlePasskey}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default PassKeyBlock;
