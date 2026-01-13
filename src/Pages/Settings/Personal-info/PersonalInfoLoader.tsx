import { IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
// import PrimaryButton from "../../../component/Buttons/PrimaryButton";
// import { useUser } from "../../../Context/UserContext";
import Placeholder from "../../../component/Placeholder/Placeholder";

const PersonalInfoLoader = () => {
  // const {profileData} = useUser();

  return (
    <div
      className="m-auto w-full 
    md:p-10
    xsm:p-4
    "
    >
      <SettingHeader title="Account Settings" />

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <label className="block text-body font-medium mb-1">Name</label>
          <div className="flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor">
            <IoPersonOutline className="text-gray-400" />
            <Placeholder width="80px" height="40px" />
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-1">Email</label>
          <div
            className={`flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor `}
          >
            <IoMailOutline className="text-gray-400" />
            <input
              className="outline-none w-full bg-transparent text-body2"
              type="email"
              placeholder="Enter your email"
              name="email"
              disabled={true}
            />
          </div>
        </div>

        {/* {showSecondaryEmailField && (
          <div>
            <label className="block text-body font-medium mb-1">
              Secondary Email
            </label>
            <div className="flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor">
              <IoMailOutline className="text-gray-400" />
              <input
                className="outline-none w-full bg-transparent text-body2"
                type="email"
                placeholder="Enter your email"
                name="secondaryEmail"

              />
            </div>
          </div>
        )} */}

        <div>
          <label className="block text-body font-medium mb-1. ">Phone</label>
          <div className="flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor">
            <IoCallOutline className="text-gray-400" />
            <input
              className="outline-none w-full bg-transparent text-body2"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* <PrimaryButton title={isLoading ? "Loading..." : "Save Changes"}
            onClick={updateProfileData}
            isLoading={isLoading}
          /> */}
      </div>
    </div>
  );
};

export default PersonalInfoLoader;
