import { useState } from "react";
import Pills from "../../../component/Pills/Pill";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
import AutoLogoutBlock from "./AutoLogutBlock";
import DateFormatBlock from "./DateFormatBlock";
import { useUser } from "../../../Context/UserContext";

// type ShowBlockProps = {
//   showBlock: string[];
// };

const UserPrefrence = () => {
  const { profileData } = useUser();
  const [showBlock, setShowBlock] = useState<string[] | null>([""]);

  const CAN_SHOW_AUTO_LOGOUT_BLOCK = profileData?.autoLogoutEnabled;
  return (
    <div
      className="m-auto w-full 
       md:p-10
    xsm:p-4"
    >
      <SettingHeader title="User Preference Settings" />

      <div className="flex justify-end mb-5 gap-4 flex-wrap">
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("auto-logout")
                ? prev.filter((item) => item !== "auto-logout")
                : [...(prev ?? []), "auto-logout"],
            );
          }}
        >
          <Pills title="Auto logout settings" />
        </div>
        <div
          onClick={() => {
            setShowBlock((prev) =>
              prev?.includes("date-format")
                ? prev.filter((item) => item !== "date-format")
                : [...(prev ?? []), "date-format"],
            );
          }}
        >
          <Pills title="Date format settings" />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {(showBlock!.includes("auto-logout") || CAN_SHOW_AUTO_LOGOUT_BLOCK) && (
          <AutoLogoutBlock />
        )}
        {showBlock!.includes("date-format") && <DateFormatBlock />}
      </div>
    </div>
  );
};

export default UserPrefrence;
