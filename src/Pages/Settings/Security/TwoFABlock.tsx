import { IoShieldCheckmarkOutline } from "react-icons/io5";

const TwoFABlock = () => {
  return (
    <>
      <div className="mx-auto border border-[#525355] rounded-[10px] p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <IoShieldCheckmarkOutline className="text-2xl text-gray-400" />
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Add an extra layer of protection to your account by enabling
          two-factor authentication (2FA).
        </p>

        <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg">
          <button className="cursor-pointer">Enable 2FA</button>
        </div>
      </div>
    </>
  );
};

export default TwoFABlock;
