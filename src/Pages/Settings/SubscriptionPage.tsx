import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import axiosClient from "../../api/axiosClient";
import Placeholder from "../../component/Placeholder/Placeholder";
import SettingHeader from "../../component/settingHeader/SettingHeader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
export default function SubscriptionPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    axiosClient
      .post("/payment", {
        amount: 1000,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

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

  if (!clientSecret && loading) {
    return (
      <div
        className="m-auto w-full 
          md:p-10
    xsm:p-4"
      >
        <SettingHeader title="Subscription" />
        <Placeholder height="250px" borderRadius="8px" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      //eslint-disable-next-line
      options={{ clientSecret, appearance } as any}
    >
      <CheckoutForm />
    </Elements>
  );
}
