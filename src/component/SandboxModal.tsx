import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCodesandboxLogo } from "react-icons/pi";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { Logger } from "../utils/Logger";
import PrimaryButton from "./Buttons/PrimaryButton";
import { useNotesApi } from "./CustomHooks/useNotesApi";

interface SandboxMoadlProps {
  onclose: () => void;
}
function SandboxMoadl({ onclose }: SandboxMoadlProps) {
  const { t } = useTranslation();
  const [numNotes, setNumNotes] = useState<number>(0);
  const [archiveNotes, setArchiveNotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useRandomData, setUseRandomData] = useState(false);
  const [useRandomImages, setUseRandomImages] = useState(false);
  const clickRef = useRef<HTMLDivElement>(null);
  const { getNotes } = useNotesApi();

  const generateData = () => {
    if (numNotes === 0) {
      toast.error(t("modals.sandbox.enterNumber"));
      return;
    }

    if (Number(archiveNotes) >= Number(numNotes)) {
      toast.error(t("modals.sandbox.archiveLessThanTotal"));
      return;
    }
    setIsLoading(true);
    axiosClient
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/generateSandbox`, {
        numNotes,
        useRandomData,
        useRandomImages,
        archiveNotes,
      })
      .then(() => {
        getNotes();
        setIsLoading(false);
        onclose();
        toast.success(t("modals.sandbox.generatedSuccess"));
      })
      .catch((error) => {
        Logger("Error generating sandbox data:", error);
        setIsLoading(false);
      });
  };

  const deletedData = () => {
    setIsLoading(true);
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteSandbox`)
      .then(() => {
        getNotes();
        setIsLoading(false);
        onclose();
      })
      .catch((error) => {
        Logger("Error deleting sandbox data:", error);
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
      <div className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-100">
        <div
          ref={clickRef}
          className="border-borderColor border rounded-[8px] w-[90%] md:w-[60%] lg:w-[40%] p-4  bg-black relative"
        >
          <div
            className="cursor-pointer text-white text-xl font-bold p-2 flex justify-between items-center"
            onClick={onclose}
          >
            <div>
              <PrimaryButton
                title={
                  isLoading
                    ? t("common.loading")
                    : t("modals.sandbox.deleteAllNotes")
                }
                onClick={deletedData}
                isLoading={isLoading}
              />
            </div>
            X
          </div>
          <div className="flex justify-center items-center ">
            <PiCodesandboxLogo className="size-15" />
          </div>

          <div className="flex flex-col gap-4 p-4">
            <p className="text-sm">{t("modals.sandbox.enterNumNotes")}</p>
            <div className="flex items-center gap-4  p-1 rounded-[4px] bg-transparent border border-borderColor ">
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
                  {t("modals.sandbox.enterArchiveNotes")}
                </p>
                <div className="flex items-center gap-4  p-1 rounded-[4px] bg-transparent border border-borderColor ">
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
            <PrimaryButton
              title={
                isLoading
                  ? t("common.loading")
                  : t("modals.sandbox.generateNotes")
              }
              onClick={generateData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SandboxMoadl;
