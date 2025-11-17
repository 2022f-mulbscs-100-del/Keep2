import React, { useState } from 'react'
import IconStyling from '../IconStyling'
import { RxCross2 } from "react-icons/rx"; // cross icon
// import { useNote } from '../../Context/noteContext';




type ListItemProps = {
  listItemIsCliced: boolean;
  setlistItemIsCliced: React.Dispatch<React.SetStateAction<boolean>>;
}



const Listitem = ({ listItemIsCliced, setlistItemIsCliced }: ListItemProps) => {



  // const {  setStoreListData, storeListData } = useNote();
const [listData, setlistData] = useState({
    id: Date.now(),
    data: '', })
  function handleListItemClick(e: React.ChangeEvent<HTMLInputElement>) {
    const newListItem = e.target.value;
    setlistData((prev) => ({ ...prev, data: newListItem }))
    console.log(listData);
  }


  return (
    <>

      <ul className={`border-y  ${listItemIsCliced ? 'border-y border-[#5F6368]' : 'border-transparent'}`}>
        <li>
          <div className={`flex items-center gap-2 px-4 p-1 `} >
            <input type="checkbox" />
            <input onChange={handleListItemClick} value={listData.data} className='w-full outline-0' type="text" onClick={() => { setlistItemIsCliced(true) }} />
            <IconStyling
              id={2}
              key={2}
              icon={RxCross2}
            />
          </div>
        </li>

      </ul>
    </>
  )
}

export default Listitem;









// i have an input track the changes of that input and store that change in a state to display 
// now where to display - display on same input field from where i get that input 
// on each indvidual list item track checked or not checked
