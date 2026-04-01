import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Placeholder from "../../../component/Placeholder/Placeholder";
import { useUser } from "../../../Context/UserContext";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
// import PrimaryButton from "../../../component/Buttons/PrimaryButton";

type changeSubscriptionModalProps = {
  onClose: () => void;
};

const ChangeSubscriptionModal = ({ onClose }: changeSubscriptionModalProps) => {
  const { t } = useTranslation();
  const [isLoading] = useState(false);
  const {
    profileData,
    fetchUserProfile,
    setProfileData,
    error: profileError,
    setError,
  } = useUser();

  useEffect(() => {
    return () => {
      setError!({ ...profileError, ProfileError: null });
    };
  }, []);

  const handleChangeSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosClient.get("/cancel-subscription");
      onClose();
      fetchUserProfile();
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const HandleMontlySubscriptionSwitchToYearly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosClient.get("/upgrade-subscription");
      onClose();
      fetchUserProfile();
      setProfileData({
        ...profileData!,
        subscriptionStatus: "active",
        subscriptionPlan: "yearly",
      });
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleChangeSubscriptionToMonthly = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.info("Switching to Monthly plan is not supported at the moment.");
    onClose();
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity" />

        <div className="relative z-10 bg-black p-6 rounded-lg w-full ">
          <div
            className="m-auto w-full 
                             md:p-10
                             xsm:p-4"
          >
            <div
              className="flex items-center mb-4
                  transition-all duration-300
                  
                  "
            >
              <div className="">
                <FaArrowLeftLong
                  className=" cursor-pointer hover:bg-[#52535596] p-2 rounded-lg
                      sm:size-10
                      xsm:size-8
                      "
                  onClick={() => {
                    onClose();
                  }}
                />
              </div>

              <div className="sm:flex-1   ">
                <h1 className="sm:text-3xl xs:text-[24px] font-bold text-nowrap text-center">
                  Update Subscription Plan
                </h1>
              </div>
            </div>
            <div style={{ margin: "auto" }}>
              <div
                className="height-[250px]"
                style={{ height: isLoading ? "250px" : "" }}
              >
                {isLoading && (
                  <div style={{}}>
                    <Placeholder height="250px" borderRadius="8px" />
                  </div>
                )}

                <div
                  style={{
                    opacity: isLoading ? 0 : 1,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                ></div>
              </div>

              <div className="flex items-center  gap-4">
                <button
                  onClick={handleChangeSubscription}
                  disabled={isLoading}
                  type="submit"
                  className=" disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
                >
                  {isLoading
                    ? t("common.loading")
                    : t("buttons.cancelSubscription")}
                </button>
                {/* 
        <PrimaryButton title={isLoading ? "Loading..." : "Cancel Subscription"}
        onClick={()=>{handleChangeSubscription(e)}}
          isLoading={isLoading}
        /> */}
                <button
                  disabled={isLoading}
                  type="submit"
                  onClick={
                    profileData?.subscriptionPlan === "monthly"
                      ? HandleMontlySubscriptionSwitchToYearly
                      : handleChangeSubscriptionToMonthly
                  }
                  className=" disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
                >
                  {isLoading
                    ? t("common.loading")
                    : `Change to ${profileData?.subscriptionPlan === "monthly" ? "Yearly" : "Monthly"} Plan`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeSubscriptionModal;
