import React from 'react'
import { TiPinOutline } from "react-icons/ti"; // Icon for unpinned note
import { TiPin } from "react-icons/ti";  // Icon for pinned note


type NoteTitleProps = {
  title: string;
  IsHover: boolean;
  setLocalIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
  NotePinned: boolean;
}

 const NoteTitle = ({title,IsHover,setLocalIsPinned,NotePinned}:NoteTitleProps) => {
  return (
   <>
   {title &&
                        <div className='font-black flex justify-between '>

                            <div className='w-[200px] max-h-[120px] overflow-hidden mb-4  '>
                                <p className="whitespace-normal break-words">
                                    {title}
                                </p>
                            </div>


                            <div className={`  transition-all z-100  duration-500 opacity-0 ${IsHover && `opacity-100`}`}>
                                {NotePinned ?

                                    <div className='rounded-full items-center  cursor-pointer w-[25px] h-[25px] p-1 hover:bg-[#52535596] '>

                                        <TiPin className=' '
                                            onClick={() => { setLocalIsPinned(false) }}
                                        />
                                    </div>

                                    :

                                    <div className='rounded-full items-center cursor-pointer w-[25px] h-[25px] p-1 hover:bg-[#52535596] '>

                                        <TiPinOutline className='cursor-pointer mr-8'
                                            onClick={() => { setLocalIsPinned(true) }}
                                        />
                                    </div>
                                }
                            </div>

                        </div>
                    }
   </>
  )
}

export default NoteTitle;