import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import IconStyling from "../IconStyling";
import { RxCross2 } from "react-icons/rx";

type InputListProps = {
  onClicked?: () => void;
  listArray?: { id: number | null; data: string }[];
  setListArray?: React.Dispatch<
    React.SetStateAction<{ id: number | null; data: string }[]>
  >;
};

export const InputList = ({ listArray, setListArray }: InputListProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    setFocusedIndex(listArray!.length);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  return (
    <>
      {listArray!.map((list, index) => (
        <>
          <ul
            key={index}
            className={`border-y  ${focusedIndex === index ? "border-y border-[#5F6368]" : "border-transparent"}`}
          >
            <li>
              <div className={`flex items-center gap-2 px-4 p-1 `}>
                <input type="checkbox" />
                <input
                  ref={inputRef}
                  onChange={(e) => {
                    setListArray!((prev) => {
                      const newList = [...prev];
                      newList[index] = {
                        ...newList[index],
                        data: e.target.value,
                      };
                      // ok so copy the whole prev array then get the index which is being rendered
                      // and then open the object of that index and in that object spread their previous data and then update the data field with the new value
                      return newList;
                    });
                  }}
                  value={list.data}
                  onClick={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  className="w-full outline-0"
                  type="text"
                />
                <IconStyling
                  id={2}
                  key={2}
                  icon={RxCross2}
                  onclick={() => {
                    setListArray!((prev) => prev.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </li>
          </ul>
        </>
      ))}
      <div
        onClick={() => {
          setListArray!((prev) => [...prev, { id: Date.now(), data: "" }]);
          const lastIndex = listArray!.length;
          //not subtracting cause right now the new item is not yet added so length is giving the correct index
          setFocusedIndex(lastIndex);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }}
        className="flex items-center gap-6 p-[7px] text-[#CFD0D3] cursor-pointer"
      >
        <IconStyling id={1} key={1} icon={FaPlus} />

        <p>List item</p>
      </div>
    </>
  );
};
