import axios from "axios";
import { useState } from "react";
import { PiCodesandboxLogo } from "react-icons/pi";
import { useNote } from "../Context/noteContext";

interface SandboxMoadlProps {
  onclose: () => void;
}
function SandboxMoadl({ onclose }: SandboxMoadlProps) {
  const [numNotes, setNumNotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchApiData } = useNote();

  const generateData = () => {
    setIsLoading(true);
    axios
      .post("http://localhost:2404/api/generateSandbox", {
        numNotes,
      })
      .then(() => {
        fetchApiData();
        setIsLoading(false);
        onclose();
      })
      .catch((error) => {
        console.error("Error generating sandbox data:", error);
        setIsLoading(false);
      });
  };

  const deletedData = () => {
    setIsLoading(true);
    axios
      .delete("http://localhost:2404/api/deleteSandbox")
      .then(() => {
        fetchApiData();
        setIsLoading(false);
        onclose();
      })
      .catch((error) => {
        console.error("Error deleting all notes:", error);
        setIsLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 100) {
      return;
    } else {
      setNumNotes(value);
    }
  };
  return (
    <>
      <div className="fixed top-0 left-0 inset-0 bg-black/10 flex justify-center items-center z-200">
        <div className="bg-black p-4 rounded-lg  flex flex-col">
          <div
            className="cursor-pointer text-white text-xl font-bold p-2 flex justify-between items-center"
            onClick={onclose}
          >
            <div>
              <button
                disabled={isLoading}
                className="w-fit rounded-md p-3 text-sm hover:bg-[#41331C] cursor-pointer"
                onClick={deletedData}
              >
                Delete All notes
              </button>
            </div>
            X
          </div>
          <div className="flex justify-center items-center ">
            <PiCodesandboxLogo className="size-15" />
          </div>

          <div className="flex flex-col gap-4 p-4">
            <p className="text-sm">Enter number of notes want to generate!!</p>
            <div className="flex items-center gap-4  p-1 rounded-[4px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="number"
                placeholder=""
                value={numNotes}
                max={100}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="w-full cursor-pointer rounded-lg p-2 hover:bg-[#41331C]"
              onClick={() => {
                generateData();
              }}
            >
              {isLoading ? "Generating..." : "Generate Data"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SandboxMoadl;
