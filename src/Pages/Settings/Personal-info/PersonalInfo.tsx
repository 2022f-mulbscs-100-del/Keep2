import { useEffect, useState } from "react";
import { IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import Pills from "../../../component/Pills/Pill";
import axiosClient from "../../../api/axiosClient";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import PersonalInfoLoader from "./PersonalInfoLoader";
import { Logger } from "../../../utils/Logger";

const PersonalInfo = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryEmail: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get("/userProfile")
      .then((res) => {
        setIsLoading(false);
        setProfileData(res.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const updateProfileData = () => {
    try {
      setIsLoading(true);
      axiosClient
        .patch("/updateProfile", { profileData })
        .then((res) => {
          setProfileData(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      Logger("Error updating profile data:", error);
    }
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const [showSecondaryEmailField, setShowSecondaryEmailField] = useState(false);

  if (isLoading) {
    return <PersonalInfoLoader />;
  }

  return (
    <div
      className="m-auto w-full 
    md:p-10
    xsm:p-4
    "
    >
      <SettingHeader title="Account Settings" />

      <div
        className="flex justify-end"
        onClick={() => {
          setShowSecondaryEmailField(true);
        }}
      >
        <Pills title="Set Secondary Email" />
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <label className="block text-body font-medium mb-1">Name</label>
          <div className="flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor">
            <IoPersonOutline className="text-gray-400" />
            <input
              className="outline-none w-full bg-transparent text-body2"
              type="text"
              placeholder="Enter your name"
              value={profileData.name}
              name="name"
              onChange={HandleChange}
            />
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
              value={profileData.email}
              onChange={HandleChange}
              disabled={true}
            />
          </div>
        </div>

        {showSecondaryEmailField && (
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
                value={profileData.secondaryEmail}
                onChange={HandleChange}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-body font-medium mb-1. ">Phone</label>
          <div className="flex items-center gap-4 px-4 py-2 rounded-[8px] bg-transparent border border-borderColor">
            <IoCallOutline className="text-gray-400" />
            <input
              className="outline-none w-full bg-transparent text-body2"
              type="tel"
              placeholder="Enter your phone number"
              value={profileData.phone}
              name="phone"
              onChange={HandleChange}
            />
          </div>
        </div>

        <PrimaryButton
          title={isLoading ? "Loading..." : "Save Changes"}
          onClick={updateProfileData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
