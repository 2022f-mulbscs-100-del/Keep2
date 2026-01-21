import React from "react";
import { Tooltip } from "react-tooltip";
type IconStylingProps = {
  icon: React.ElementType;
  id: number;
  tooltip?: string;
  onclick?: () => void;
};

const IconStyling = ({ icon, tooltip, onclick }: IconStylingProps) => {
  const Icon = icon;
  return (
    <>
      <div
        data-tooltip-id={`${tooltip}-tooltip`}
        data-tooltip-content={tooltip}
        className="rounded-full flex justify-center items-center cursor-pointer w-[30px] h-[30px] p-1 hover:bg-secondary "
        onClick={onclick}
      >
        <Icon className="cursor-pointer " />
      </div>
      <Tooltip id={`${tooltip}-tooltip`} place="top" />
    </>
  );
};

export default IconStyling;
