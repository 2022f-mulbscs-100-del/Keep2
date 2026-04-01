import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function Input() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-4  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
        <IoSearch />
        <input
          className="outline-none w-full text-body2"
          type="text"
          placeholder={t("input.searchPlaceholder")}
        />
      </div>
    </>
  );
}
