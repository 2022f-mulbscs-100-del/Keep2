import React from "react";
import Listitem from "./Listitem";
import { FaPlus } from "react-icons/fa";
import IconStyling from "../IconStyling";

type InputListProps = {
  listItemIsCliced: boolean;
  setlistItemIsCliced: React.Dispatch<React.SetStateAction<boolean>>;
  onClicked?: () => void;
};

export const InputList = ({
  listItemIsCliced,
  setlistItemIsCliced,
  onClicked,
}: InputListProps) => {
  return (
    <>
      <div>
        {/* { storeListData.map((item)=>{
                        return( */}
        <Listitem
          // key={item.id}
          listItemIsCliced={listItemIsCliced}
          setlistItemIsCliced={setlistItemIsCliced}
        />
        {/* )
                        })} */}

        <div
          onClick={() => {
            if (onClicked) {
              onClicked();
            }
          }}
          className="flex items-center gap-6 p-[7px] text-[#CFD0D3] cursor-pointer"
        >
          <IconStyling id={1} key={1} icon={FaPlus} />

          <p>List item</p>
        </div>
      </div>
    </>
  );
};
