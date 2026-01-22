import { IoSearch } from "react-icons/io5";

type LiveSearchInputProps = {
  query: string;
  setQuery: (query: string) => void;
};
const LiveSearchInput = ({ query, setQuery }: LiveSearchInputProps) => {
  return (
    <>
      <div className="relative">
        <div className="flex items-center gap-4  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
          <IoSearch />
          <input
            className="outline-none w-full text-body2"
            type="text"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
            placeholder="Search"
          />
        </div>
        <div className="absolute top-10 w-full bg-black/60  z-10"></div>
      </div>
    </>
  );
};
export default LiveSearchInput;
