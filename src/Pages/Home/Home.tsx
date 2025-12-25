import Masonry from "react-masonry-css";
// import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";
import { useNote } from "../../Context/noteContext";
import { useEffect } from "react";

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

  // Define breakpoints for responsive columns
  const breakpointColumns = {
    default: 5, // 5 columns on large screens
    1400: 4, // 4 columns on medium-large
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <div className="p-4">{/* <NoteInput /> */}</div>

      <div className="px-4 mt-10">
        <div className="flex pl-11 text-[10px]">
          <h1>PINNED</h1>
        </div>

        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {items.length > 0 &&
            items.map((item: NoteType) => {
              return (
                <Note
                  key={item.id} // Use id instead of index for better performance
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
