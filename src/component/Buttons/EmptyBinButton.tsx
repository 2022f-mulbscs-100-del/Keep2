import { useNote } from "../../Context/noteContext";

 const EmptyBin = () => {

    const {setDeletedNotes} =useNote();

 const DeleteAll = () => {
  setDeletedNotes([]); 
};
  
    return (
  <>

   <div onClick={DeleteAll} className='hover:bg-[#31384569] px-6 py-2 rounded-[3px] text-[#8AB4F8] cursor-pointer'> 
    <button className='cursor-pointer'>Empty Bin</button>
    </div>
  </>
  )
}

export default EmptyBin;