import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom";




function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handlePasswordToggle = (id: number) => {
        if (id === 1) {
          setShowPassword(!showPassword);
    
        }
        if (id === 2) {
          setShowConfirmPassword(!showConfirmPassword);
    
        }
      }

    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-center items-center h-full mt-10">

                <div className="">
                    <div className="flex flex-col items-center mb-4">
                        <h1 className="font-bold text-2xl">Sign Up</h1>
                        <p>to continue to Keeper</p>
                    </div>

                    <div className="flex flex-col gap-4 ">
                        <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                            <input className='outline-none w-full' type="text"
                                placeholder='Name'
                            />
                        </div>
                        <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                            <input className='outline-none w-full' type="text"
                                placeholder='Email'
                            />
                        </div>

                        <div>
                            <div className='flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] '>
                                <input className='outline-none w-full' type={`${showPassword ? "text" : "password"}`}
                                    placeholder='Password'
                                />

                                {!showPassword ?

                                    <FaRegEyeSlash className="cursor-pointer" onClick={()=>handlePasswordToggle(1)} />
                                    :
                                    <FaRegEye className="cursor-pointer" onClick={()=>handlePasswordToggle(1)} />
                                }

                            </div>
                            <div className='flex items-center gap-4  px-4 min-w-[400px]  py-2 rounded-[8px] bg-transparent border border-[#525355] mt-4'>
                                <input className='outline-none w-full' type={`${showConfirmPassword ? "text" : "password"}`}
                                    placeholder='Confirm Password'
                                />

                                {!showConfirmPassword ?

                                    <FaRegEyeSlash className="cursor-pointer" onClick={()=>handlePasswordToggle(2)} />
                                    :
                                    <FaRegEye className="cursor-pointer" onClick={()=>handlePasswordToggle(2)} />
                                }

                            </div>
                            <div className="text-[12px] ml-2 mt-2 cursor-pointer"
                            onClick={()=>{
                                navigate('/login')
                            }}
                            >
                                Already have account?
                            </div>
                        </div>

                    </div>

                    <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg">
                        <button className="cursor-pointer" >
                            SignUp
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SignUp;