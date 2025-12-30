import { IoCalendarOutline, IoChevronDownOutline } from "react-icons/io5";

const DateFormatBlock = () => {
  return (
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
  );
};

export default DateFormatBlock;
