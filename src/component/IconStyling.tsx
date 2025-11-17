import React from 'react'



type IconStylingProps = {
  icon: React.ElementType; // Accepts a component (not JSX!)
  id: number;
};

 const IconStyling = ({icon}:IconStylingProps) => {
    const Icon = icon;
  return (
   <>
    <div className='rounded-full flex justify-center items-center cursor-pointer w-[30px] h-[30px] p-1 hover:bg-[#52535596] '>      
                         <Icon className='cursor-pointer '/>
                           
                           </div>
   </>
  )
}


export default IconStyling;