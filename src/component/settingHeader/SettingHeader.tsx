import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type SettingHeaderProps = {
  title: string;
};

const SettingHeader = ({ title }: SettingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="flex items-center mb-4
   transition-all duration-300
   
   "
      >
        <div className="">
          <FaArrowLeftLong
            className=" cursor-pointer hover:bg-[#52535596] p-2 rounded-lg
       sm:size-10
       xsm:size-8
       "
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>

        <div className="sm:flex-1   ">
          <h1 className="sm:text-3xl xs:text-[24px] font-bold text-nowrap text-center">
            {title}
          </h1>
        </div>
      </div>
    </>
  );
};

export default SettingHeader;
