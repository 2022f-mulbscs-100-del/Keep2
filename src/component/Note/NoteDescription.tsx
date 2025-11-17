import React from 'react'
import { TiPinOutline } from "react-icons/ti"; // Icon for unpinned note
import { TiPin } from "react-icons/ti";    // Icon for pinned note



type NoteDescriptionProps = {  
setLocalIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  IsHover: boolean;
  NotePinned: boolean;
}
 const NoteDescription = ({title,description,IsHover,NotePinned,setLocalIsPinned}:NoteDescriptionProps) => {
  return (
    <>
    <div className='max-h-[430px] overflow-hidden ' >
                        {!title &&
                            <div className={` float-right h-fit transition-all z-100  duration-500 opacity-0 ${IsHover && `opacity-100`}`}>

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
                        }

                        <p >
                            {description}
                        </p>

                    </div>
    
    </>
  )
}


export default NoteDescription;