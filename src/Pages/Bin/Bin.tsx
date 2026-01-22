import { MdDelete } from "react-icons/md";
import { useNavbar } from "../../Context/navbarContext";
import EmptyBin from "../../component/Buttons/EmptyBinButton";
import Note from "../../component/Note/Note";
import { useNote } from "../../Context/noteContext";
import { useEffect } from "react";
import Loader from "../../component/Note/Loader/Loader";

const Bin = () => {
  const { layout } = useNavbar();
  const { deletedNotes, DeletedNotes, loading } = useNote();

  useEffect(() => {
    DeletedNotes();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center p-8 gap-8">
        <div className="flex items-center  gap-10">
          <p className="italic text-nowrap mt-4">
            Notes in the Recycle Bin are deleted after 7 days.
          </p>
          {deletedNotes.length != 0 && <EmptyBin />}
        </div>
      </div>

      <main
        className={`px-4 mt-5 ${layout && "flex flex-col justify-center items-center gap-4"}`}
      >
        {loading.deleteLoading ? (
          <Loader />
        ) : deletedNotes.length >= 0 ? (
          <div
            className={` ${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
         gap-4 space-y-4 transition-all transform duration-500`}
          >
            {deletedNotes.map((item, index) => {
              return (
                <div key={item.id} className="break-inside-avoid">
                  <Note
                    key={index}
                    id={item?.id || 0}
                    title={item?.title || ""}
                    description={item?.description || ""}
                    NotePinned={item?.pinned || false}
                    image={item?.image || []}
                    list={item?.list || []}
                    category={item?.category || ""}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-40 flex flex-col justify-center items-center gap-4">
            <MdDelete className="h-[100px] w-[100px] text-[#37383A]" />
            <h1 className="text-2xl font-bold text-[#9AA0A6]">
              No notes in Recycle Bin
            </h1>
          </div>
        )}
      </main>
    </>
  );
};

export default Bin;
