import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useState } from "react";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import { useTranslation } from "react-i18next";

type changeSubscriptionPlanProps = {
  ACTIVE_SUBSCRIPTION: boolean;
};

const ChangeSubscriptionPlan = ({
  ACTIVE_SUBSCRIPTION,
}: changeSubscriptionPlanProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {ACTIVE_SUBSCRIPTION && (
        <div className="md:px-10 xsm:px-4 mt-4">
          <div className="mx-auto border border-borderColor rounded-[10px] p-6">
            <div className="flex items-center gap-4 mb-4">
              <IoShieldCheckmarkOutline className="text-2xl text-gray-400" />
              <h2 className="text-xl font-semibold">
                {t("subscription.cancelSubscriptionTitle")}
              </h2>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {t("subscription.cancelSubscriptionDescription")}
            </p>

            <PrimaryButton
              title={t("buttons.cancelSubscription")}
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
