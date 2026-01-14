import SettingHeader from "../../../component/settingHeader/SettingHeader";
// import PrimaryButton from "../../../component/Buttons/PrimaryButton";
// import { useUser } from "../../../Context/UserContext";
import Placeholder from "../../../component/Placeholder/Placeholder";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";

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
          
            <Placeholder height="40px" />
        </div>

        <div>
          <label className="block text-body font-medium mb-1">Email</label>
     
            <Placeholder height="40px" />

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
        
          <Placeholder height="40px" />
         
        </div>

        <PrimaryButton title={  "Loading..."}
          />
      </div>
    </div>
  );
};

export default PersonalInfoLoader;
