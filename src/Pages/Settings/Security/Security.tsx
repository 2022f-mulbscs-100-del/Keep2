import SettingHeader from "../../../component/settingHeader/SettingHeader";
import { useState } from "react";
import Pills from "../../../component/Pills/Pill";
import TwoFABlock from "./TwoFABlock";
import ResetPasswordBlock from "./ResetPasswordBlock";

const Security = () => {
  const [showBlock, setShowBlock] = useState<string[] | null>([
    "two-factor-authentication",
  ]);

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title="Security Settings" />
      <div className="flex justify-end mb-5 gap-4 flex-wrap">
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("two-factor-authentication")
                ? prev.filter((item) => item !== "two-factor-authentication")
                : [...(prev ?? []), "two-factor-authentication"],
            );
          }}
        >
          <Pills title="Two-Factor Authentication" />
        </div>
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("reset-password")
                ? prev.filter((item) => item !== "reset-password")
                : [...(prev ?? []), "reset-password"],
            );
          }}
        >
          <Pills title="Reset password" />
        </div>
      </div>
      {showBlock!.includes("reset-password") && <ResetPasswordBlock />}
      {showBlock!.includes("two-factor-authentication") && ( //this tell the compiler that we know the value of showBlock is not null
        <TwoFABlock />
      )}
    </div>
  );
};

export default Security;
