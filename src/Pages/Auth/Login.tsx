import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

import { useNavigate } from "react-router-dom"



function Login() {
    const [showPassword,setShowPassword]=useState(false)
    const navigate = useNavigate()

    const handlePasswordToggle =()=>{
setShowPassword(!showPassword);
    }
    return (
        <>
        <div className="flex justify-center items-center h-full mt-10">

            <div className="">
                <div className="flex flex-col items-center mb-4">
                    <h1 className="font-bold text-2xl">Login In</h1>
                    <p>to continue to Keeper</p>
                </div>

                <div className="flex flex-col gap-4 ">
                    <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                        <input className='outline-none w-full' type="text"
                            placeholder='Email'
                        />
                    </div>

                   <div>
                   <div className='flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] '>
                        <input className='outline-none w-full' type={`${showPassword?"text":"password"}`}
                            placeholder='Password'
                        />
                       
                        {!showPassword?
                        
                        <FaRegEyeSlash className="cursor-pointer" onClick={handlePasswordToggle} /> 
                        :
                        <FaRegEye className="cursor-pointer" onClick={handlePasswordToggle}/>
                        }

                    </div>
                    <div className="text-[12px] ml-2 mt-2 cursor-pointer"
                    onClick={()=>{navigate('/forget-password')}}
                    >
                         Forget Password?
                        </div>
                   </div>

                </div>

                <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg">
                    <button className="cursor-pointer" >
                    Login
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login