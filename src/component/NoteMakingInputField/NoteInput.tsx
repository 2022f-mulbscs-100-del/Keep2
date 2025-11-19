import React, { useEffect, useRef, useState } from 'react'
import { TiPinOutline } from "react-icons/ti";
import { TiPin } from "react-icons/ti";
import { FaImage } from "react-icons/fa";
import IconStyling from '../IconStyling'
import { CiViewList } from "react-icons/ci";

import { InputList } from './InputList';
import IconsArray from '../../../public/Data';
import { useLocation } from 'react-router-dom';
import { useNote } from '../../Context/noteContext';
import axios from 'axios';


export const NoteInput = () => {
    // checking  the current path 
    const {pathname} = useLocation();

    const { setlistData, archievedNote, deletedNotes, NoteChange, setNoteChange, StoreNoteChange, setStoreNoteChange, Ispinned, setIspinned } = useNote();
    const [LocalIsPinned, setLocalIsPinned] = useState(false);
    const [InputClick, setInputClick] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const [listClick, setListClick] = useState(false);
    const [listItemIsCliced, setlistItemIsCliced] = useState(true);
    const {fetchApiData} = useNote();
    const [dataSubmit, setDataSubmit] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(e.target as Node)
            ) {
                if (InputClick && (NoteChange.note || NoteChange.description)) { setStoreNoteChange(prev => [...prev, NoteChange]); }
                setInputClick(false);
                setLocalIsPinned(false);
                setListClick(false);
                if(NoteChange.note ==="" && NoteChange.description ==="") return;
                const sendNotwe= {
                    title: NoteChange.note,
                    description: NoteChange.description,
                    id: NoteChange.id,
                    pinned: NoteChange.pinned,
                    catgeory: NoteChange.catgeory
                }
                axios.post('http://localhost:2404/api/addnotes', sendNotwe)
                .then(() => {
                    fetchApiData();
                })
                .catch(error => {
                    console.error('Error adding note:', error);
                })
                ;
                setDataSubmit(false);
                setNoteChange({
                    note: "",
                    description: "",
                    id: Date.now(),
                    pinned: false,
                    catgeory: ""
                })
                setlistData({
                    id: Date.now(),
                    data: '',
                    pinned: false,
                    catgeory: ''
                });
            }
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [NoteChange,dataSubmit]);

    //   useEffect(() => {
    //   setNoteChange(prev => ({
    //     ...prev,
    //     pinned: Ispinned,
    //   }));

    // }, [Ispinned]);


    const HandleNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNoteChange(prevValue => ({
            ...prevValue,
            [name]: value
        }))
        setNoteChange(prev => ({ ...prev, catgeory: pathname }))
        console.log(NoteChange)
    }
    // track StoreNoteChange 
    useEffect(() => {
        console.log("Updated StoreNoteChange:", StoreNoteChange);
    }, [StoreNoteChange]);

    // track archieve and delete notes changes 
    useEffect(() => {
        console.log("Updated archieved note array : ", archievedNote)
        console.log("Updated delete note array : ", deletedNotes)
    }, [archievedNote, deletedNotes]);



    return (


        <>

            <div className='flex justify-center items-center'>
                {!InputClick ?
                    // close input field

                    // <CloseNoteInput
                    // inputRef={inputRef}
                    // HandleNoteChange={HandleNoteChange}
                    // NoteChange={NoteChange}
                    // setInputClick={setInputClick}
                    // setListClick={setListClick}
                    // />

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


                    // open input field
                    :

                    <div ref={inputRef} className='shadow-2xl min-w-[600px] py-4 border rounded-[8px] border-[#5F6368] flex flex-col gap-2'>

                        {/* title input field */}
                        <div className='flex w-full px-4'>

                            <input onChange={HandleNoteChange} autoComplete='off'
                                className='w-full outline-none ' type="text" placeholder='Title' name='note'
                                value={NoteChange.note}
                            />


                                {/* pinned icon */}
                            {LocalIsPinned ?

                                <div className='rounded-full  cursor-pointer w-[25px] h-[25px] p-1 hover:bg-[#52535596] '>

                                    <TiPin className=' '
                                        onClick={() => {
                                            setLocalIsPinned(false)
                                            setIspinned(false);

                                            setNoteChange(prev => ({
                                                ...prev,
                                                pinned: Ispinned,
                                            }));
                                        }

                                        }
                                    />
                                </div>

                                :

                                <div className='rounded-full  cursor-pointer w-[25px] h-[25px] p-1 hover:bg-[#52535596] '>

                                    <TiPinOutline className='cursor-pointer mr-8'
                                        onClick={() => {
                                            setLocalIsPinned(true);
                                            setIspinned(true);
                                            setNoteChange(prev => ({
                                                ...prev,
                                                pinned: Ispinned,
                                            }));
                                        }}
                                    />
                                </div>

                            }

                        </div>

                        {/* description input field */}
                        {!listClick ?
                            <div className='px-4'>

                                <textarea onChange={HandleNoteChange} autoComplete='off'
                                    value={NoteChange.description}
                                    className='w-full outline-none resize-none' rows={2} name="description" id="" placeholder='Take a note...' ></textarea >
                            </div>
                            :
                            // input list

                   <InputList
                     listItemIsCliced={listItemIsCliced}
                              setlistItemIsCliced={setlistItemIsCliced}
                   
                   />

                        }
                        {/* list of icon */}
                        <div className=' flex items-center  justify-between px-4'>

                            <div className=' flex justify-between items-center gap-8 '>



                                {
                                    IconsArray.map((item) => {
                                        return (
                                            <IconStyling
                                                key={item.id}
                                                id={item.id}
                                                icon={item.icon}
                                            />
                                        )
                                    })
                                }

                            </div>

                            {/* close icon */}
                            <div className='pr-6' onClick={() => {

                                setStoreNoteChange(prev => [...prev, NoteChange]);
                                setInputClick(false);
                                setNoteChange({
                                    note: "",
                                    description: "",
                                    id: Date.now(),
                                    pinned: false,
                                    catgeory: ""
                                })
                            }}>
                                <p className='cursor-pointer hover:bg-[#56585b1f] px-5 py-2'
                                onClick={()=>{setDataSubmit(true)}}
                                >
                                    close</p>
                            </div>

                        </div>

                    </div>

                }

            </div>
        </>
    )
}

export default NoteInput;