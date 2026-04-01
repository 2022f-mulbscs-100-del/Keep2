import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../Context/LanguageContext";

const languages = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = languages.find((l) => l.code === currentLanguage);

  return (
    <div ref={ref} className="relative w-fit">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md 
                   hover:bg-[#1a1a1a] text-gray-300 
                   hover:text-white  transition-all"
      >
        {current?.label || "Language"}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute mt-2 w-40 bg-[#1a1a1a] border border-gray-800 
                        rounded-lg shadow-lg overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-all
                ${
                  currentLanguage === lang.code
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
