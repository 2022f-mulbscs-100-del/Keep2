
import Masonry from "react-masonry-css";
// import { useNote } from "../../Context/noteContext";
import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";
import { useEffect, useState } from "react";
import { useNote } from "../../Context/noteContext";



const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

interface NoteType {
  _id: number;
  title: string;
  description: string;
  pinned: boolean;
}

export default function Home() {

  // const { StoreNoteChange } = useNote();
const {items} = useNote();

  return (
    <>
      <div className="p-4">
        <NoteInput />
      </div>

      <div className="px-4 mt-10">
        <div className="pl-4 text-[10px]"><h1>PINNED</h1></div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid "
          columnClassName="my-masonry-grid_column"
        >
          {items.length > 0 && (
            items.map((item, index) => {

              return (
                <Note
                  key={index}
                  id={item?._id}
                  title={item?.title}
                  description={item?.description}
                  NotePinned={item?.pinned}
                />

              )
            })

          )}

        </Masonry>
      </div>
    </>
  );
}
