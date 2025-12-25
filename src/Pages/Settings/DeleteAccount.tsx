import { IoTrashOutline } from "react-icons/io5";
import SettingHeader from "../../component/settingHeader/SettingHeader";

const DeleteAccount = () => {
  const handleDelete = () => {
    // TODO: API call for delete account
    console.log("Account deleted");
  };

  return (
    <div
      className="m-auto w-full 
        md:p-10
    xsm:p-4"
    >
      <SettingHeader title="Delete Account" />

      <div className="mx-auto border border-[#525355] rounded-[10px] p-6">
        <div className="flex items-center gap-4 mb-4">
          <IoTrashOutline className="text-2xl text-red-400" />
          <h2 className="text-xl font-semibold text-red-400">Delete Account</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>

        <div
          onClick={handleDelete}
          className="hover:bg-red-500/10 cursor-pointer flex justify-center p-2 rounded-lg"
        >
          <button className="cursor-pointer text-red-400">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
