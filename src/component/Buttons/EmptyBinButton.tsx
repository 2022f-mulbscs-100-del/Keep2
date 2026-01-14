import { toast } from "react-toastify";
import { useNote } from "../../Context/noteContext";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import PrimaryButton from "./PrimaryButton";
import { useState } from "react";

const EmptyBin = () => {
  const { DeletedNotes } = useNote();
  const [isLoading, setIsLoading] = useState(false);
  const EmptyBin = () => {
    setIsLoading(true);
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteNotes`)
      .then(() => {
        setIsLoading(false);
        toast.success("Bin empty successfully");
        DeletedNotes();
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
