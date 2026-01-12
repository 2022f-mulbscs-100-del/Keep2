
import { IoSearch } from "react-icons/io5";

export default function Input() {
  return (
    <>
     <div className='flex items-center gap-4  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor '>
            <IoSearch />
        <input className='outline-none w-full text-body2' type="text" 
        placeholder='Search'
        />
        </div>
    </>
  )
}
