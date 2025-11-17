
import { IoMdArchive } from "react-icons/io";
import { useNavbar } from '../../Context/navbarContext';
import { useNote } from '../../Context/noteContext';
import Note from "../../component/Note/Note";

 const Archieve = () => {
  
  const {archievedNote , Ispinned} = useNote();
   const { layout } = useNavbar();
  return (
 <>

<main className={`px-4 mt-5 ${layout && 'flex flex-col justify-center items-center gap-4'}`}>
 {
  archievedNote.length == 0 ? 
<div className='mt-50 flex flex-col justify-center items-center gap-4'>
<IoMdArchive className='h-[100px] w-[100px] text-[#37383A]'/>
 <h1 className='text-2xl font-bold text-[#9AA0A6]'>Your archived notes appear here</h1>
  </div>
   :
  archievedNote.map((item ,index)=>{
    return(

<div   key={index} className={` mr-8 ${layout ? 'float-none':`float-left`}`}>
  <Note

              
                  id={item.id}
                  title={item.note}
                  description={item.description}
                   NotePinned={Ispinned}
/>
</div>
    )
  })}
</main>
</>
  )


}

export default Archieve;


