import React from 'react'
import IconStyling from '../IconStyling'
import { CiViewList } from 'react-icons/ci'
import { FaImage } from 'react-icons/fa'

type CloseNoteInputProps = {
  inputRef: React.RefObject<HTMLDivElement | null>;
  HandleNoteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;   
  NoteChange: { note: string };
  setInputClick: React.Dispatch<React.SetStateAction<boolean>>;
  setListClick: React.Dispatch<React.SetStateAction<boolean>>;
};

 const CloseNoteInput = ({inputRef,HandleNoteChange,NoteChange,setInputClick,setListClick}:CloseNoteInputProps) => {
  return (
   <>
        <div ref={inputRef} className='shadow-lg min-w-[600px] py-2  px-4 border rounded-[5px] border-[#5F6368] flex flex-col gap-2'>

                        <div className='flex w-full '>

                            <input className='w-full outline-none ' type="text" placeholder='Take a note'
                                onChange={HandleNoteChange}
                                value={NoteChange.note}
                                onClick={() => { setInputClick(true) }}
                            />

                            <div className='flex items-center gap-6 '>

                                <div onClick={() => {
                                    setListClick(true);
                                    setInputClick(true);
                                }}>
                                    <IconStyling
                                        id={1}
                                        icon={CiViewList}
                                    />
                                </div>

                                <IconStyling
                                    id={2}
                                    icon={FaImage}
                                />


                            </div>
                        </div>
                    </div>
   </>
  )
}

export default CloseNoteInput;