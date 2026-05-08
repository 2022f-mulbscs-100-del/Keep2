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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const clickRef = useRef<HTMLDivElement>(null);
  const { getNotes } = useNotesApi();

  const generateData = () => {
    if (numNotes === 0) {
      toast.error(t("modals.sandbox.enterNumber"));
      return;
    }

    setIsGenerating(true);
    axiosClient
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/generateSandbox`, {
        numNotes,
      })
      .then(() => {
        getNotes();
        setIsGenerating(false);
        onclose();
        toast.success(t("modals.sandbox.generatedSuccess"));
      })
      .catch((error) => {
        Logger("Error generating sandbox data:", error);
        setIsGenerating(false);
      });
  };

  const deletedData = () => {
    setIsDeleting(true);
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteSandbox`)
      .then(() => {
        getNotes();
        setIsDeleting(false);
        onclose();
      })
      .catch((error) => {
        Logger("Error deleting sandbox data:", error);
        setIsDeleting(false);
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
                  isDeleting
                    ? t("common.loading")
                    : t("modals.sandbox.deleteAllNotes")
                }
                onClick={deletedData}
                isLoading={isDeleting}
              />
            </div>
            <span onClick={onclose}>X</span>
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
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <PrimaryButton
              title={
                isGenerating
                  ? t("common.loading")
                  : t("modals.sandbox.generateNotes")
              }
              onClick={generateData}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SandboxMoadl;
