import { IoCheckmark } from "react-icons/io5";



type SelectIconProps = {
  IsHover: boolean;
}


 const SelectIcon = ({IsHover}:SelectIconProps) => {



  return (
   <>
   <div
    className={`absolute top-[-7] left-[-7] transition-all z-100  duration-500 opacity-0 ${IsHover && `opacity-100`}`} >
                    <div className='flex justify-center items-center h-[20px] w-[20px] bg-white rounded-full'>
                        <IoCheckmark className='text-[#202124] ' />
                    </div>
                </div>
   </>
  )
}

export default SelectIcon;
