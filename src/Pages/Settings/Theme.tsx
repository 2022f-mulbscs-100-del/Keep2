import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import { useTheme } from "../../Context/themeSwitcherContext";
import PrimaryButton from "../../component/Buttons/PrimaryButton";

const Theme = () => {
  const { settingTheme } = useTheme();

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title="Theme Settings" />

      <div className="mx-auto border border-borderColor rounded-[10px] p-6">
        {/* Light Theme Option */}
        <div className="flex items-center gap-4 mb-4">
          <IoSunnyOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">Light Theme</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          A bright theme for your application interface.
        </p>

        <PrimaryButton
          title={"Apply Light Theme"}
          onClick={() => settingTheme("light")}
        />

        {/* Dark Theme Option */}
        <div className="flex items-center gap-4 mb-4">
          <IoMoonOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">Dark Theme</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          A dark theme for better readability and reduced eye strain.
        </p>

        <PrimaryButton
          title={"Apply dark Theme"}
          onClick={() => settingTheme("dark")}
        />
      </div>
    </div>
  );
};

export default Theme;
