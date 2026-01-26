import { useState } from "react";
import { MdBlockFlipped } from "react-icons/md";

type ColorPaletteProps = {
  setColor: React.Dispatch<React.SetStateAction<string>>;
};
const ColorPalette = ({ setColor }: ColorPaletteProps) => {
  const [active, setActive] = useState<number>(0);
  const ColorPaletteArray = [
    { id: 0, color: "" },
    { id: 1, color: "bg-[#DC2626]" },
    { id: 2, color: "bg-[#EA580C]" },
    { id: 3, color: "bg-[#D97706]" },
    { id: 4, color: "bg-[#059669]" },
    { id: 5, color: "bg-[#0891B2]" },
    { id: 6, color: "bg-[#2563EB]" },
    { id: 7, color: "bg-[#7C3AED]" },
    { id: 8, color: "bg-[#DB2777]" },
    { id: 9, color: "bg-[#64748B]" },
    { id: 10, color: "bg-[#1F2937]" },
  ];
  return ColorPaletteArray.map((item) => {
    return (
      <div className="flex items-center gap-5 h-[40px]">
        <div
          key={item.id}
          className={`rounded-full h-[35px]   ${active == item.id ? " border-transparent w-[38px] h-[38px] border-4 scale-110 " : "border-transparent"} w-[35px] ${item.color} cursor-pointer hover:scale-110 transition-all duration-200 mx-1`}
          onClick={() => {
            setActive(item.id);
            setColor(item.color);
          }}
        >
          {item.id === 0 && (
            <MdBlockFlipped className="w-full h-full opacity-50" />
          )}
        </div>
      </div>
    );
  });
  //
};

export default ColorPalette;
