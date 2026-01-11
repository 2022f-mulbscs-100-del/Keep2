import { toast } from "react-toastify";
import { useNote } from "../../Context/noteContext";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";

const EmptyBin = () => {
  const { DeletedNotes } = useNote();

  const EmptyBin = () => {
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteNotes`)
      .then(() => {
        toast.success("Bin empty successfully");
        DeletedNotes();
      })
      .catch((error) => {
      Logger("Error emptying bin:", error);
      });
  };

  return (
    <>
      <div
        onClick={EmptyBin}
        className="hover:bg-[#31384569] px-6 py-2 rounded-[3px] text-[#8AB4F8] cursor-pointer"
      >
        <button className="cursor-pointer">Empty Bin</button>
      </div>
    </>
  );
};

export default EmptyBin;
