import { IoCalendarOutline, IoChevronDownOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const DateFormatBlock = () => {
  const { t } = useTranslation();
  return (
    <div className="border border-borderColor rounded-[10px] p-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-4">
          <IoCalendarOutline className="text-subheading2 text-gray-400 mt-1" />
          <h2 className="text-subheading2 font-semibold mb-1">
            {t("userPreferences.dateFormat")}
          </h2>
        </div>
        <p className="text-body text-gray-400">
          {t("userPreferences.dateFormatDescription")}
        </p>
      </div>

      <div className="relative">
        <select
          className="appearance-none bg-transparent border border-borderColor
               rounded-[8px] px-4 py-2 pr-10 outline-none text-sm w-full
               [&>option]:bg-[#1f1f1f] [&>option]:text-white cursor-pointer"
        >
          <option value="dd-mm-yyyy">
            {t("userPreferences.dateFormatPattern")}
          </option>
          <option value="mm-dd-yyyy">MM / DD / YYYY</option>
          <option value="yyyy-mm-dd">YYYY / MM / DD</option>
        </select>

        <IoChevronDownOutline
          className="absolute right-3 top-1/2 -translate-y-1/2
               pointer-events-none text-gray-400"
        />
      </div>
    </div>
  );
};

export default DateFormatBlock;
