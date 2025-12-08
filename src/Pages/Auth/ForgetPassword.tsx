import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"


function ForgetPassword() {
  const [stage, setStage] = useState("codeToEmail")
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordToggle = (id: number) => {
    if (id === 1) {
      setShowPassword(!showPassword);

    }
    if (id === 2) {
      setShowConfirmPassword(!showConfirmPassword);

    }
  }
  const codeToEmail = () => {
    setStage("codeConfirmation")
  }

  const codeConfirmation = () => {
    setStage("forgetPassword")
  }

  return (
    <>
      {stage === "codeToEmail" &&

        <div className="flex justify-center items-center h-full mt-10">

          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-2xl">Forget Password</h1>
              <p className="opacity-50">Enter your email we will send code to reset password</p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                <input className='outline-none w-full' type="text"
                  placeholder='Email'
                />
              </div>


            </div>

            <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg"
              onClick={codeToEmail}
            >
              <button className="cursor-pointer" >
                Send
              </button>
            </div>
          </div>
        </div>
      }
      {
        stage === "codeConfirmation" &&
        <div className="flex justify-center items-center h-full mt-10">

          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-2xl">Forget Password</h1>
              <p className="opacity-50">Check your email for code</p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                <input className='outline-none w-full' type="text"
                  placeholder='Enter the code'
                />
              </div>


            </div>

            <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg"
              onClick={codeConfirmation}
            >
              <button className="cursor-pointer" >
                Continue
              </button>
            </div>
          </div>
        </div>
      }

      {
        stage === "forgetPassword" &&
        <div className="flex justify-center items-center h-full mt-10">

          <div className="">
            <div className="flex flex-col items-center mb-4">
              <h1 className="font-bold text-2xl">Forget Password</h1>
              <p className="opacity-50">Check your email for code</p>
            </div>

            <div className="flex flex-col gap-4 ">
              <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                <input className='outline-none w-full' type={`${showPassword ? "text" : "password"}`}
                  placeholder='Enter your new password'
                />
                {!showPassword ?

                  <FaRegEyeSlash className="cursor-pointer" onClick={() => handlePasswordToggle(1)} />
                  :
                  <FaRegEye className="cursor-pointer" onClick={() => handlePasswordToggle(1)} />
                }
              </div>
              <div className='flex items-center gap-4 min-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] '>

                <input className='outline-none w-full' type={`${showConfirmPassword ? "text" : "password"}`}
                  placeholder='Conifrm your password'
                />
                {!showConfirmPassword ?

                  <FaRegEyeSlash className="cursor-pointer" onClick={() => handlePasswordToggle(2)} />
                  :
                  <FaRegEye className="cursor-pointer" onClick={() => handlePasswordToggle(2)} />
                }
              </div>

            </div>

            <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 mt-4 rounded-lg">
              <button className="cursor-pointer" onClick={() => navigate('/')}>
                Continue
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ForgetPassword