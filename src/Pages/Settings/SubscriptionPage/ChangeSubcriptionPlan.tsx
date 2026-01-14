import { IoShieldCheckmarkOutline } from "react-icons/io5";
import type { paymentMethodtype } from "../../../types/Payment.types";
import { useState } from "react";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";

type changeSubscriptionPlanProps = {
  ACTIVE_SUBSCRIPTION: boolean;
  paymentMethod: paymentMethodtype | null;
};

const ChangeSubscriptionPlan = ({
  paymentMethod,
  ACTIVE_SUBSCRIPTION,
}: changeSubscriptionPlanProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {ACTIVE_SUBSCRIPTION && (
        <div className="md:px-10 xsm:px-4 mt-4">
          <div className="mx-auto border border-borderColor rounded-[10px] p-6 ">
            <div className="flex items-center gap-4 mb-4">
              <IoShieldCheckmarkOutline className="text-2xl text-gray-400" />
              <h2 className="text-xl font-semibold">Change Subscription</h2>
            </div>

            {paymentMethod && (
              <div className="space-y-0 overflow-hidden rounded-lg border border-borderColor bg-[#36363898]">
                <div className="flex justify-between items-center p-4 bg-[#36363898]/50">
                  <span className="text-gray-400">Card Number</span>
                  <span className="text-white font-mono">
                    •••• {paymentMethod?.card.last4}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-black/30 border-t border-borderColor">
                  <span className="text-gray-400">Brand</span>
                  <span className="text-white uppercase font-medium">
                    {paymentMethod?.card?.brand}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4  border-borderColor bg-[#36363898]/50 border-t ">
                  <span className="text-gray-400">Expiration</span>
                  <span className="text-white font-mono">
                    {String(paymentMethod?.card?.exp_month).padStart(2, "0")}/
                    {paymentMethod?.card?.exp_year}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 border-borderColor bg-black/30 border-t ">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">
                    {paymentMethod?.funding}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 border-borderColor bg-[#36363898]/50 border-t ">
                  <span className="text-gray-400">Country</span>
                  <span className="text-white">{paymentMethod?.country}</span>
                </div>
              </div>
            )}

            <PrimaryButton
              title={"Change Subscription Plan"}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <ChangeSubscriptionModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default ChangeSubscriptionPlan;
