
import { IoMdArchive } from "react-icons/io";
import { useNavbar } from '../../Context/navbarContext';
import { useNote } from '../../Context/noteContext';
import Note from "../../component/Note/Note";
import { useEffect } from "react";

const Archieve = () => {

  const { archievedNote,ArchivedNotes } = useNote();
  const { layout } = useNavbar();

  useEffect(() => {
    ArchivedNotes();
  },[]);
  return (
    <>

      <main className={`px-4 mt-5 ${layout && 'flex flex-col justify-center items-center gap-4'}`}>
        {
          archievedNote.length == 0 ?
            <div className='mt-50 flex flex-col justify-center items-center gap-4'>
              <IoMdArchive className='h-[100px] w-[100px] text-[#37383A]' />
              <h1 className='text-2xl font-bold text-[#9AA0A6]'>Your archived notes appear here</h1>
            </div>
            :
            archievedNote.map((item, index) => {
              return (

                <div key={index} className={` mr-8 ${layout ? 'float-none' : `float-left`}`}>
                  <Note
                    key={index}
                    id={item?.id}
                    title={item?.title}
                    description={item?.description}
                    NotePinned={item?.pinned}
                  />
                </div>
              )
            })}
      </main>
    </>
  )


}

export default Archieve;


