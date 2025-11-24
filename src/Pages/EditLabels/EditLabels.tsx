import { TbLabelFilled } from "react-icons/tb";
import { useNote } from "../../Context/noteContext";
import Note from "../../component/Note/Note";
const EditLabels = () => {
  const { archievedNote, Ispinned } = useNote();
  return (
    <>
      <main className="px-4 mt-5">
        {archievedNote.length == 0 ? (
          <div className="mt-50 flex flex-col justify-center items-center gap-4">
            <TbLabelFilled className="h-[100px] w-[100px] text-[#37383A]" />
            <h1 className="text-2xl font-bold text-[#9AA0A6]">
              No notes with this label yet
            </h1>
          </div>
        ) : (
          archievedNote.map((item, index) => {
            return (
              <div key={index} className="float-left  mr-8">
                <Note
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  NotePinned={Ispinned}
                />
              </div>
            );
          })
        )}
      </main>
    </>
  );
};

export default EditLabels;
