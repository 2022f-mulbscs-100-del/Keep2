
import { FaBell } from "react-icons/fa";
import { useNote } from "../../Context/noteContext";
import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";



const Reminder = () => {
  const { remainderNote } = useNote();
  const { StoreNoteChange, Ispinned } = useNote();
  const allRemainder= [...StoreNoteChange.filter(item => item.catgeory === "/reminders"), ...remainderNote];
  return (
    <>
      <div className="p-4">
        <NoteInput />
      </div>

      <main className='px-4 mt-5'>
        {
          allRemainder.length == 0 ?
            <div className='mt-50 flex flex-col justify-center items-center gap-4'>
              <FaBell className='h-[100px] w-[100px] text-[#37383A]' />
              <h1 className='text-2xl font-bold text-[#9AA0A6]'>Notes with upcoming reminders appear here</h1>
            </div>
            :
            allRemainder.map((item, index) => {
              if(item.catgeory ==='/reminders') // Check if the category is 'reminders'
              return (

                <div key={index} className='float-left  mr-8'>
                  <Note


                    id={item.id}
                    title={item.note}
                    description={item.description}
                    NotePinned={Ispinned}
                  />
                </div>
              )
            }
            
            )}
      </main>
    </>
  )
}

export default Reminder; 