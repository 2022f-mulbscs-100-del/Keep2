
import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useEditLaber } from "../Context/editLabelContext";
import { useState } from "react";



const Dialougebox = ({  setisActive }:{setisActive: React.Dispatch<React.SetStateAction<number | null>>}) => {

    const [focus, setFocus] = useState(false)
    const [input, setInput] = useState('')
    const {label, setLabel} = useEditLaber();



    const HandleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)

    }

    const HandleClick = () => {

        setLabel((pv) => {
            return (
                [...pv, input]
            )
        })
        setInput("")
    }

    const InputHandler = () => {
        setFocus(!focus);
    }

    const deleteNote = (id: number) => {
        setLabel(
            (prev) => {
                return (
                    prev.filter((_, index) => index !== id)
                )

            }
        )
    }

    console.log(
        "inputchange", input,
        "label", label);

    return (
        <>
            <div className='h-fit w-[300px] z-100 fixed inset-0 m-auto bg-[#313235]  drop-shadow-lg '>

                <div className='p-4 pt-0 border-b-2 border-[#525355]' >
                    <div className='py-2'>
                        <h1>Edit Labels</h1>
                    </div>

                    {/* input field */}
                    <div>
                        <div className='flex py-3 gap-4 items-center '>
                            {focus ? <RxCross2 className='cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-[#52535596]' /> : <FaPlus className='cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-[#52535596]' />}


                            <input className='py-1 border-b border-transparent focus:border-b focus:border-[#525355] outline-none ' type="text" value={input} placeholder='Create new label'
                                onFocus={InputHandler}
                                onBlur={InputHandler}
                                onChange={HandleChange}
                            />

                            {focus && <MdOutlineDone onMouseDown={HandleClick} className='cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-[#52535596]' />}

                        </div>


                        {

                            label.map((item, index) => {

                                return (
                                    <div className='flex py-2 justify-between items-center' key={index}>
                                        <MdDelete onClick={() => { deleteNote(index) }} className='cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-[#52535596]' />
                                        <input className='py-1 border-b border-transparent focus:border-b focus:border-[#525355] outline-none ' type="text" defaultValue={item} placeholder='Create new label'
                                            onFocus={() => setFocus(true)}
                                            onBlur={() => setFocus(false)}
                                           
                                        />
                                        <MdEdit className='cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-[#52535596]' />
                                    </div>
                                )
                            })

                        }




                        {/* <div className='flex py-2 justify-between items-center'>
                        <MdDelete />
                        <input type="text" />
                        <MdEdit />
                    </div>
                    <div className='flex py-2 justify-between items-center'>
                        <MdDelete />
                        <input type="text" />
                        <MdEdit />
                    </div> */}

                    </div>
                </div>

                {/* footer */}
                <div className='p-4 flex justify-end items-center '>
                    <div 

                   onClick={() => {
  setisActive(4);
}}

 className='hover:bg-[#52535596] py-2 px-4 rounded-[3px] cursor-pointer'>
                    <h1>Done</h1>
                </div>

            </div>
        </div >
        </>
    )
}


export default Dialougebox;