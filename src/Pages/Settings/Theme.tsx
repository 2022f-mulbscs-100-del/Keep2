import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";
import { useTheme } from "../../Context/themeSwitcherContext";
import PrimaryButton from "../../component/Buttons/PrimaryButton";
import { useTranslation } from "react-i18next";

const Theme = () => {
  const { settingTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title={t("settings.themeSettings")} />

      <div className="mx-auto border border-borderColor rounded-[10px] p-6">
        {/* Light Theme Option */}
        <div className="flex items-center gap-4 mb-4">
          <IoSunnyOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">{t("settings.lightTheme")}</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          {t("settings.lightThemeDesc")}
        </p>

        <PrimaryButton
          title={t("settings.applyLightTheme")}
          onClick={() => settingTheme("light")}
        />

        {/* Dark Theme Option */}
        <div className="flex items-center gap-4 mb-4">
          <IoMoonOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">{t("settings.darkTheme")}</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          {t("settings.darkThemeDesc")}
        </p>

        <PrimaryButton
          title={t("settings.applyDarkTheme")}
          onClick={() => settingTheme("dark")}
        />
      </div>
    </div>
  );
};

export default Theme;
