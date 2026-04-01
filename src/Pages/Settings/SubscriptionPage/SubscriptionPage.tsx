import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import axiosClient from "../../../api/axiosClient";
import Placeholder from "../../../component/Placeholder/Placeholder";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../../../Context/UserContext";
import Pills from "../../../component/Pills/Pill";
import ChangeSubscriptionPlan from "./ChangeSubcriptionPlan";
import UpdatePaymentMethod from "./UpdatePaymentMethod";
import { useTranslation } from "react-i18next";
import type { paymentMethodtype } from "../../../types/Payment.types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<paymentMethodtype | null>(
    null,
  );
  const [choosePlan, setChoosePlan] = useState("monthly");
  const [plan, setPlan] = useState(false);
  const [showBlock, setShowBlock] = useState<string[] | null>([""]);

  const { profileData } = useUser();
  const ACTIVE_SUBSCRIPTION = profileData?.subscriptionStatus === "active";

  useEffect(() => {
    setLoading(true);
    setClientSecret(null);
    if (profileData?.subscriptionStatus !== "active") {
      axiosClient
        .post("/create-payment-intent", {
          plan: choosePlan,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [plan, profileData?.subscriptionStatus]);

  const appearance = {
    theme: "night", // dark theme
    variables: {
      colorBackground: "transparent", // Changed from '#1e1e1e' to transparent
      colorText: "#ffffff",
      colorPrimary: "#ffffff",
      colorDanger: "#ff4d4f",
      fontFamily: "sans-serif",
      borderRadius: "8px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        backgroundColor: "rgba(0,0,0,0)",
        padding: "16px 8px",
        color: "#fff",
      },
      ".Label": { color: "#fff", fontSize: "14px" },
      ".Tab": { backgroundColor: "rgba(0,0,0,0)", color: "#fff" },
      ".Tab:hover": { backgroundColor: "#36363898" },
      ".Tab--selected": { color: "#fff", backgroundColor: "transparent" },
      ".TabLabel--selected": { color: "#fff" },
      ".AccordionItem": {
        color: "#fff",
        backgroundColor: "transparent",
      },
      ".AccordionItem--selected": {
        color: "#fff",
        backgroundColor: "transparent",
      },
      ".PaymentRequestButton-message": {
        color: "#fff",
      },
      ".PaymentRequestButton-icon": {
        color: "#fff",
      },
    },
  };

  return (
    <>
      <div className="mt-10 mx-10">
        <SettingHeader title={t("subscription.subscriptionTitle")} />
        {ACTIVE_SUBSCRIPTION && (
          <div className="flex justify-end mb-5 gap-4 flex-wrap">
            <div
              onClick={() => {
                setShowBlock((prev) =>
                  prev?.includes("subscription-plan")
                    ? prev.filter((item) => item !== "subscription-plan")
                    : [...(prev ?? []), "subscription-plan"],
                );
              }}
            >
              <Pills title={t("subscription.changeSubscriptionPlan")} />
            </div>

            <div
              onClick={() => {
                setShowBlock((prev) =>
                  prev?.includes("payment-method")
                    ? prev.filter((item) => item !== "payment-method")
                    : [...(prev ?? []), "payment-method"],
                );
              }}
            >
              <Pills title={t("subscription.updatePaymentMethod")} />
            </div>
          </div>
        )}
      </div>

      {ACTIVE_SUBSCRIPTION && (
        <div className="space-y-4 md:px-10 ">
          {/* Pro Status Card */}
          <div className="border border-borderColor rounded-lg p-6 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IoShieldCheckmarkOutline className="text-2xl text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t("subscription.proUser")}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {profileData?.subscriptionPlan === "monthly"
                      ? t("subscription.monthly")
                      : t("subscription.yearly")}{" "}
                    {t("subscription.subscriptionLabel")}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-700 bg-opacity-10 border border-green-700">
                <span className="text-sm text-white font-medium capitalize">
                  {profileData?.subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="border border-borderColor rounded-lg overflow-hidden ">
            <div className="flex justify-between items-center p-4 border-b border-borderColor">
              <span className="text-gray-400">{t("subscription.plan")}</span>
              <span className="text-white font-medium capitalize">
                {profileData?.subscriptionPlan}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border-b border-borderColor">
              <span className="text-gray-400">{t("subscription.amount")}</span>
              <span className="text-white font-medium">
                ${profileData?.subscriptionPlan === "monthly" ? "10" : "100"} /{" "}
                {profileData?.subscriptionPlan === "monthly"
                  ? t("subscription.month")
                  : t("subscription.year")}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border-b border-borderColor">
              <span className="text-gray-400">{t("subscription.status")}</span>
              <span className="text-white font-medium capitalize">
                {profileData?.subscriptionStatus}
              </span>
            </div>

            <div className="flex justify-between items-center p-4">
              <span className="text-gray-400">
                {t("subscription.nextBilling")}
              </span>
              <span className="text-white font-medium">
                {new Date(
                  profileData?.subscriptionExpiry + "T00:00:00",
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
      {profileData && profileData.subscriptionStatus !== "active" && (
        <div
          className=" md:px-10
          xsm:px-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              {t("subscription.subscriptionPlan")}
            </h2>
            <div className="flex gap-2  rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  setPlan(false);
                  setChoosePlan("monthly");
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  !plan
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-secondary"
                }`}
              >
                {t("subscription.monthly")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlan(true);
                  setChoosePlan("yearly");
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  plan
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-secondary"
                }`}
              >
                {t("subscription.yearly")}
              </button>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-black-800 bg-opacity-50  p-6 border border-borderColor rounded-[10px] flex justify-between items-center mb-6">
            <div>
              <span className="text-1xl font-bold flex  items-baseline gap-1">
                {plan
                  ? t("subscription.upgradeYearly")
                  : t("subscription.upgradeMonthly")}
              </span>
            </div>
            <div className="flex justify-end items-baseline gap-1">
              <span className="text-4xl font-bold">${plan ? "100" : "10"}</span>
              <span className="text-gray-400">
                {t("subscription." + (plan ? "perYear" : "perMonth"))}
              </span>
            </div>
          </div>
        </div>
      )}
      {profileData &&
        profileData.subscriptionStatus !== "active" &&
        (!clientSecret && loading ? (
          <div className="md:px-10 xsm:px-4">
            <Placeholder height="250px" borderRadius="8px" />
          </div>
        ) : (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            // eslint-disable-next-line
            options={{ clientSecret, appearance } as any}
          >
            <CheckoutForm choosePlan={choosePlan} />
          </Elements>
        ))}

      {showBlock?.includes("payment-method") && (
        <UpdatePaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          ACTIVE_SUBSCRIPTION={ACTIVE_SUBSCRIPTION}
        />
      )}

      {showBlock?.includes("subscription-plan") && (
        <ChangeSubscriptionPlan
          paymentMethod={paymentMethod}
          ACTIVE_SUBSCRIPTION={ACTIVE_SUBSCRIPTION}
        />
      )}
    </>
  );
}
