import { IoMdArchive } from "react-icons/io";
import { useNavbar } from "../../Context/navbarContext";
import { useNote } from "../../Context/noteContext";
import Note from "../../component/Note/Note";
import { useEffect } from "react";
import Loader from "../../component/Note/Loader/Loader";

const Archieve = () => {
  const { archievedNote, ArchivedNotes, loading } = useNote();
  const { layout } = useNavbar();

  useEffect(() => {
    ArchivedNotes();
  }, []);
  return (
    <>
      <main
        className={`px-4 mt-5 ${layout && "flex flex-col justify-center items-center gap-4"}`}
      >
        {loading.archiveLoading ? (
          <Loader />
        ) : archievedNote.length == 0 ? (
          <div
            className={` ${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
            gap-4 space-y-4 transition-all transform duration-500`}
          >
            {archievedNote.map((item, index) => {
              return (
                <div key={item.id} className="break-inside-avoid">
                  <Note
                    key={index}
                    id={item?.id || 0}
                    title={item?.title || ""}
                    description={item?.description || ""}
                    NotePinned={item?.pinned || false}
                    image={item?.image}
                    list={item?.list || []}
                    category={item?.category || ""}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-50 flex flex-col justify-center items-center gap-4">
            <IoMdArchive className="h-[100px] w-[100px] text-[#37383A]" />
            <h1 className="text-2xl font-bold text-[#9AA0A6]">
              Your archived notes appear here
            </h1>
          </div>
        )}
      </main>
    </>
  );
};

export default Archieve;
