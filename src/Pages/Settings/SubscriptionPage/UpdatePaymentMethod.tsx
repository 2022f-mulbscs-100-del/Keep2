import { IoShieldCheckmarkOutline } from "react-icons/io5";
import UpdateSubscriptionModal from "./UpdateSubscriptionModal";
import type { paymentMethodtype } from "../../../types/Payment.types";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
type updatePaymentMethodProps = {
  ACTIVE_SUBSCRIPTION: boolean;
  paymentMethod: paymentMethodtype | null;
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<paymentMethodtype | null>
  >;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdatePaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  setIsModalOpen,
  isModalOpen,
  ACTIVE_SUBSCRIPTION,
}: updatePaymentMethodProps) => {
  const OpenModal = () => {
    setIsModalOpen(!OpenModal);
  };
  return (
    <>
      {ACTIVE_SUBSCRIPTION && (
        <div className="md:px-10 xsm:px-4 mt-4">
          <div className="mx-auto border border-borderColor rounded-[10px] p-6 ">
            <div className="flex items-center gap-4 mb-4">
              <IoShieldCheckmarkOutline className="text-2xl text-gray-400" />
              <h2 className="text-xl font-semibold">Update Payment Method</h2>
            </div>

            {paymentMethod && (
              <div className="space-y-0 overflow-hidden rounded-lg border border-borderColor bg-[#36363898]">
                <div className="flex justify-between items-center p-4 bg-[#36363898]/50">
                  <span className="text-gray-400">Card Number</span>
                  <span className="text-white font-mono">
                    •••• {paymentMethod?.card.last4}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-black/30 border-t border-borderColor border-borderColor-800">
                  <span className="text-gray-400">Brand</span>
                  <span className="text-white uppercase font-medium">
                    {paymentMethod?.card?.brand}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4  border border-borderColor bg-[#36363898]/50 border-t border-borderColor-800">
                  <span className="text-gray-400">Expiration</span>
                  <span className="text-white font-mono">
                    {String(paymentMethod?.card?.exp_month).padStart(2, "0")}/
                    {paymentMethod?.card?.exp_year}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 border border-borderColor bg-black/30 border-t border-borderColor-800">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">
                    {paymentMethod?.funding}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 border border-borderColor bg-[#36363898]/50 border-t border-borderColor-800">
                  <span className="text-gray-400">Country</span>
                  <span className="text-white">{paymentMethod?.country}</span>
                </div>
              </div>
            )}

            {isModalOpen && (
              <UpdateSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setPaymentMethod={setPaymentMethod}
              />
            )}

            <PrimaryButton title="Update Payment Method" onClick={OpenModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePaymentMethod;
