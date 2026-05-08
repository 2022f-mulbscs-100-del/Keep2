import React, { useEffect, useState } from "react";
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
  const { fetchUserProfile, error: profileError, setError } = useUser();

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
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        <div
          className="relative z-10 w-full max-w-xl bg-black border border-borderColor rounded-[10px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="m-auto w-full md:p-10 xsm:p-6">
            <div
              className="flex items-center mb-4
                  transition-all duration-300
                  
                  "
            >
              <div className="sm:flex-1">
                <h1 className="sm:text-3xl xs:text-[24px] font-bold text-nowrap text-center">
                  {t("subscription.cancelSubscriptionTitle")}
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

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  type="button"
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg border border-borderColor bg-black/30 text-white font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  onClick={handleChangeSubscription}
                  disabled={isLoading}
                  type="button"
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t("common.loading") : t("buttons.confirm")}
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
