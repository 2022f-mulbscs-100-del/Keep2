import SettingHeader from "../../../component/settingHeader/SettingHeader";
import { useState } from "react";
import Pills from "../../../component/Pills/Pill";
import TwoFABlock from "./TwoFABlock";
import ResetPasswordBlock from "./ResetPasswordBlock";
import MFABlock from "./MFABlock";
import { useUser } from "../../../Context/UserContext";
import PassKeyBlock from "./PassKeyBlock";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Security = () => {
  const { t } = useTranslation();
  const [showBlock, setShowBlock] = useState<string[] | null>([
    "two-factor-authentication",
  ]);

  const { profileData } = useUser();

  const CAN_SHOW_MFA_BLOCK = profileData?.MfaEnabled;
  const CAN_SHOW_2FA_BLOCK = profileData?.isTwoFaEnabled;
  const CAN_SHOW_PASS_KEY_BLOCK = profileData?.passKeyEnabled;
  const isActiveSubscriber = profileData?.subscriptionStatus === "active";
  const canAccessPassKey = isActiveSubscriber || CAN_SHOW_PASS_KEY_BLOCK;

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title={t("security.securitySettingsTitle")} />
      <div className="flex justify-end mb-5 gap-4 flex-wrap">
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("reset-password")
                ? prev.filter((item) => item !== "reset-password")
                : [...(prev ?? []), "reset-password"],
            );
          }}
        >
          <Pills title={t("security.resetPassword")} />
        </div>

        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("two-factor-authentication")
                ? prev.filter((item) => item !== "two-factor-authentication")
                : [...(prev ?? []), "two-factor-authentication"],
            );
          }}
        >
          <Pills title={t("security.twoFactorAuthentication")} />
        </div>
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("MFA")
                ? prev.filter((item) => item !== "MFA")
                : [...(prev ?? []), "MFA"],
            );
          }}
        >
          <Pills title={t("security.totp")} />
        </div>
        <div
          onClick={() => {
            if (!canAccessPassKey) {
              toast.info(
                "Upgrade to Pro to use Passkey. Go to Settings > Subscription to upgrade.",
              );
              return;
            }
            setShowBlock((prev) =>
              prev?.includes("Pass-key")
                ? prev.filter((item) => item !== "Pass-key")
                : [...(prev ?? []), "Pass-key"],
            );
          }}
        >
          <Pills title={t("security.passkey")} disabled={!canAccessPassKey} />
        </div>
      </div>
      {showBlock!.includes("reset-password") && <ResetPasswordBlock />}
      {(showBlock!.includes("two-factor-authentication") ||
        CAN_SHOW_2FA_BLOCK) && ( //this tell the compiler that we know the value of showBlock is not null
        <TwoFABlock />
      )}
      {(showBlock!.includes("MFA") || CAN_SHOW_MFA_BLOCK) && <MFABlock />}
      {(showBlock!.includes("Pass-key") || CAN_SHOW_PASS_KEY_BLOCK) &&
        canAccessPassKey && <PassKeyBlock />}
    </div>
  );
};

export default Security;
