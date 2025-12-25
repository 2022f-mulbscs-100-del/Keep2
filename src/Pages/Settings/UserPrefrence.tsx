import {
  IoTimerOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import { useState } from "react";
import Pills from "../../component/Pills/Pill";
import SettingHeader from "../../component/settingHeader/SettingHeader";

// type ShowBlockProps = {
//   showBlock: string[];
// };

const UserPrefrence = () => {
  const [autoLogout, setAutoLogout] = useState(true);

  const [showBlock, setShowBlock] = useState<string[] | null>(["auto-logout"]);

  return (
    <div
      className="m-auto w-full 
       md:p-10
    xsm:p-4
    
    "
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
        {showBlock!.includes("auto-logout") && (
          <div className="border border-[#525355] rounded-[10px] p-6 flex items-center justify-between">
            <div>
              <div className="flex items-start gap-4">
                <IoTimerOutline className="text-2xl text-gray-400 mt-1" />
                <h2 className="text-xl font-semibold mb-1">Auto Logout</h2>
              </div>
              <p className="text-sm text-gray-400 ">
                Automatically sign out after a period of inactivity.
              </p>
            </div>

            <button
              onClick={() => setAutoLogout(!autoLogout)}
              className={`relative w-12 h-6 rounded-full transition cursor-pointer ${
                autoLogout ? "bg-[#41331C]" : "bg-gray-500"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  autoLogout ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        )}
        {showBlock!.includes("date-format") && (
          <div className="border border-[#525355] rounded-[10px] p-6 flex items-center justify-between">
            <div>
              <div className="flex items-start gap-4">
                <IoCalendarOutline className="text-2xl text-gray-400 mt-1" />
                <h2 className="text-xl font-semibold mb-1">Date Format</h2>
              </div>
              <p className="text-sm text-gray-400">
                Choose how dates are displayed across the app.
              </p>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-transparent border border-[#525355]
               rounded-[8px] px-4 py-2 pr-10 outline-none text-sm w-full
               [&>option]:bg-[#1f1f1f] [&>option]:text-white cursor-pointer"
              >
                <option value="dd-mm-yyyy">DD / MM / YYYY</option>
                <option value="mm-dd-yyyy">MM / DD / YYYY</option>
                <option value="yyyy-mm-dd">YYYY / MM / DD</option>
              </select>

              <IoChevronDownOutline
                className="absolute right-3 top-1/2 -translate-y-1/2
               pointer-events-none text-gray-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPrefrence;
