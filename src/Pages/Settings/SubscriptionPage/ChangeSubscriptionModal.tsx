import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Placeholder from "../../../component/Placeholder/Placeholder";
import { useUser } from "../../../Context/UserContext";

type changeSubscriptionModalProps = {
  onClose: () => void;
};

const ChangeSubscriptionModal = ({ onClose }: changeSubscriptionModalProps) => {
  const [isLoading] = useState(false);
  const { profileData } = useUser();
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
            <form style={{ margin: "auto" }}>
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
                  disabled={isLoading}
                  type="submit"
                  className=" disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
                >
                  {isLoading ? "Loading..." : "Cancel Subscription"}
                </button>

                <button
                  disabled={isLoading}
                  type="submit"
                  className=" disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
                >
                  {isLoading
                    ? "Loading..."
                    : `Change to ${profileData?.subscriptionStatus === "monthly" ? "Yearly" : "Monthly"} Plan`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeSubscriptionModal;
