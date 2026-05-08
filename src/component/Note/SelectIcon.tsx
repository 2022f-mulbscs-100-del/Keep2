import { IoCheckmark } from "react-icons/io5";

const SelectIcon = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <>
      <div
        className={`absolute top-[-7] left-[-7] transition-all z-100   opacity-0 ${isSelected ? "opacity-100" : ""} group-hover:opacity-100`}
      >
        <div className="flex justify-center items-center h-[20px] w-[20px] bg-white rounded-full">
          <IoCheckmark className="text-[#202124] " />
        </div>
      </div>
    </>
  );
};

export default SelectIcon;
