import { useEffect, useRef, useState } from "react";
import { PiCodesandboxLogo } from "react-icons/pi";
import { useNote } from "../Context/noteContext";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

interface SandboxMoadlProps {
  onclose: () => void;
}
function SandboxMoadl({ onclose }: SandboxMoadlProps) {
  const [numNotes, setNumNotes] = useState<number>(0);
  const [archiveNotes, setArchiveNotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useRandomData, setUseRandomData] = useState(false);
  const [useRandomImages, setUseRandomImages] = useState(false);
  const clickRef = useRef<HTMLDivElement>(null);
  const { fetchApiData } = useNote();

  const generateData = () => {
    if (numNotes === 0) {
      toast.error("Please Enter the number of notes to generate");
      return;
    }

    if (Number(archiveNotes) >= Number(numNotes)) {
      console.log("archiveNotes:", archiveNotes);
      console.log("numNotes:", numNotes);
      toast.error("Archive notes should be less than total notes");
      return;
    }
    setIsLoading(true);
    axiosClient
      .post("http://localhost:2404/api/generateSandbox", {
        numNotes,
        useRandomData,
        useRandomImages,
        archiveNotes,
      })
      .then(() => {
        fetchApiData();
        setIsLoading(false);
        onclose();
        toast.success("Sandbox data generated successfully");
      })
      .catch((error) => {
        console.error("Error generating sandbox data:", error);
        setIsLoading(false);
      });
  };

  const deletedData = () => {
    setIsLoading(true);
    axiosClient
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
    if (e.target.name === "numNotes") {
      const value = parseInt(e.target.value);
      if (value > 100) {
        return;
      } else {
        setNumNotes(value);
      }
    }

    if (e.target.name === "archiveNotes") {
      const value = parseInt(e.target.value);
      setArchiveNotes(value);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
        onclose();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onclose]);
  return (
    <>
      <div className="fixed top-0 left-0 inset-0 bg-black/10 flex justify-center items-center z-150">
        <div
          ref={clickRef}
          className="bg-black p-4 rounded-lg  flex flex-col z-200"
        >
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
                name="numNotes"
                placeholder=""
                value={numNotes}
                max={100}
                onChange={handleInputChange}
              />
            </div>
            {numNotes > 0 && (
              <div>
                <p className="text-sm">
                  Enter number of notes you want to Archive
                </p>
                <div className="flex items-center gap-4  p-1 rounded-[4px] bg-transparent border border-[#525355] ">
                  <input
                    className="outline-none w-full"
                    type="number"
                    name="archiveNotes"
                    placeholder=""
                    value={archiveNotes}
                    max={100}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={useRandomData}
                  onChange={(e) => setUseRandomData(e.target.checked)}
                />
                Generate Notes with Random Pinned
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={useRandomImages}
                  onChange={(e) => setUseRandomImages(e.target.checked)}
                />
                Generate Notes with Random Images
              </label>
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
