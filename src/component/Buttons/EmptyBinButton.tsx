import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import PrimaryButton from "./PrimaryButton";
import { useState } from "react";
import { useNotesApi } from "../CustomHooks/useNotesApi";

const EmptyBin = () => {
  const { fetchDeletedNotes } = useNotesApi();
  const [isLoading, setIsLoading] = useState(false);
  const EmptyBin = () => {
    setIsLoading(true);
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteNotes`)
      .then(() => {
        setIsLoading(false);
        toast.success("Bin empty successfully");
        fetchDeletedNotes();
      })
      .catch((error) => {
        setIsLoading(false);
        Logger("Error emptying bin:", error);
      });
  };

  return (
    <>
      <PrimaryButton
        title={isLoading ? "Loading..." : "Empty Bin"}
        onClick={EmptyBin}
        isLoading={isLoading}
      />
    </>
  );
};

export default EmptyBin;
