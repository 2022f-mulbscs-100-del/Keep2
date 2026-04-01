import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdFilterList,
  MdArchive,
  MdLabel,
  MdNotifications,
  MdClose,
  MdDelete,
} from "react-icons/md";
import type { FilterState } from "../../../types/FilterType";

type FilterButtonProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const FilterButton: React.FC<FilterButtonProps> = ({ filters, setFilters }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableLabels: string[] = [
    t("filters.labels.work"),
    t("filters.labels.personal"),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (filterType: keyof Omit<FilterState, "labels">) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const toggleLabel = (label: string) => {
    setFilters((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      archived: false,
      bin: false,
      reminder: false,
      labels: [],
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) =>
    key === "labels" ? value.length > 0 : value === true,
  );

  const activeFilterCount =
    (filters.archived ? 1 : 0) +
    (filters.bin ? 1 : 0) +
    (filters.reminder ? 1 : 0) +
    filters.labels.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 cursor-pointer rounded hover:bg-secondary transition flex items-center gap-2 relative "
      >
        <MdFilterList size={20} />
        <span>{t("filters.filterNotes")}</span>
        {activeFilterCount > 0 && (
          <span className="absolute bg-secondary -top-1 -right-1   text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full  mt-2 right-0 rounded-lg shadow-lg border border-borderColor w-64 z-50 bg-background`}
        >
          <div className="p-3 border-b border-borderColor flex items-center justify-between">
            <h3 className="font-semibold ">{t("filters.filterNotes")}</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs hover:bg-secondary p-2  flex items-center gap-1 cursor-pointer"
              >
                <MdClose size={16} />
                {t("filters.clear")}
              </button>
            )}
          </div>

          <div className="p-2 max-h-[400px] customScrollBar overflow-auto">
            {/* Status Filters */}
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase px-2 mb-2">
                {t("filters.status")}
              </p>

              <button
                onClick={() => toggleFilter("archived")}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded mb-1 hover:bg-secondary transition ${
                  filters.archived ? "bg-primary " : ""
                }`}
              >
                <MdArchive size={18} />
                <span className="flex-1 text-left">
                  {t("filters.archived")}
                </span>
                {filters.archived && (
                  <div className="w-2 h-2  bg-black rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => toggleFilter("bin")}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded mb-1 hover:bg-secondary transition ${
                  filters.bin ? "bg-primary " : ""
                }`}
              >
                <MdDelete size={18} className="" />
                <span className="flex-1 text-left">{t("filters.bin")}</span>
                {filters.bin && (
                  <div className="w-2 h-2  bg-black rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => toggleFilter("reminder")}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded hover:bg-secondary transition ${
                  filters.reminder ? "bg-primary " : ""
                }`}
              >
                <MdNotifications size={18} />
                <span className="flex-1 text-left">
                  {t("filters.hasReminder")}
                </span>
                {filters.reminder && (
                  <div className="w-2 h-2  bg-black rounded-full"></div>
                )}
              </button>
            </div>

            {/* Labels Filter */}
            <div className="border-t border-borderColor pt-3">
              <p className="text-xs font-semibold  uppercase px-2 mb-2">
                {t("filters.labels.title")}
              </p>

              {availableLabels.map((label: string) => (
                <button
                  key={label}
                  onClick={() => toggleLabel(label)}
                  className={`w-full  cursor-pointer flex items-center gap-3 mb-1 px-3 py-2 rounded hover:bg-secondary transition ${
                    filters.labels.includes(label) ? "bg-primary " : ""
                  }`}
                >
                  <MdLabel size={18} />
                  <span className="flex-1 text-left">{label}</span>
                  {filters.labels.includes(label) && (
                    <div className="w-2 h-2  bg-black rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-3 border-t border-borderColor ">
              <p className="text-xs ">
                {t("filters.activeFilters", { count: activeFilterCount })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
