import Masonry from "react-masonry-css";
import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";
import { useNote } from "../../Context/noteContext";
import { useEffect } from "react";

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1,
};

interface NoteType {
  id: number;
  title: string;
  description: string;
  pinned: boolean;
  image: string;
}

export default function Home() {
  const { items, fetchApiData } = useNote();

  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <>
      <div className="p-4">
        <NoteInput />
      </div>

      <div className="px-4 mt-10">
        <div className="flex  pl-11 text-[10px]">
          <h1>PINNED</h1>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid "
          columnClassName="my-masonry-grid_column"
        >
          {items.length > 0 &&
            items.map((item: NoteType, index: number) => {
              return (
                <Note
                  key={index}
                  id={item?.id}
                  title={item?.title}
                  description={item?.description}
                  NotePinned={item?.pinned}
                  image={JSON.parse(item?.image)}
                />
              );
            })}
        </Masonry>
      </div>
    </>
  );
}
