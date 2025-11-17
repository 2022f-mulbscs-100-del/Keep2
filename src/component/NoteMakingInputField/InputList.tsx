import React from 'react'
import Listitem from './Listitem'
import { FaPlus } from 'react-icons/fa'
import IconStyling from '../IconStyling'
import { useNote } from '../../Context/noteContext'


type InputListProps = {
  listItemIsCliced: boolean;
  setlistItemIsCliced: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InputList = ({listItemIsCliced,setlistItemIsCliced}:InputListProps) => {

const {listData, setlistData,setStoreListData,storeListData} = useNote();
return (
<>

         <div>
                       {/* { storeListData.map((item)=>{
                        return( */}
                          <Listitem
                          // key={item.id}
                          listItemIsCliced={listItemIsCliced}
                          setlistItemIsCliced={setlistItemIsCliced}
                          />
                        {/* )
                        })} */}
                              

                                    <div onClick={()=>{
                                      setStoreListData (
                                        (prev)=> [...prev, listData]
                                      )
                                      setlistData({
                                        id: Date.now(),
                                        data: '',
                                        pinned: false,
                                        catgeory: ''})
                                      console.log(storeListData);
                                    }
                                    } className='flex items-center gap-6 p-[7px] text-[#CFD0D3] cursor-pointer'>
                                       <IconStyling
                                       id={1}
                                       key={1}
                                       icon={FaPlus}
                                       />

                                        <p >List item</p>
                                    </div>
                               
                            </div></>
  )
}
