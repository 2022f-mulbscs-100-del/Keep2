import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Placeholder from "../../../component/Placeholder/Placeholder";
import UpdateForm from "./UpdateForm";

type updateSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<paymentMethodtype | null>
  >;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
type paymentMethodtype = {
  id: string;
  object: string;
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string | null;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: null;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata: Record<string, string>;
  type: string;
  funding: string;
  country: string;
};

const UpdateSubscriptionModal = ({
  isOpen,
  onClose,
  setPaymentMethod,
}: updateSubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    axiosClient
      .get(`/setUpIntent`)
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const appearance = {
    theme: "night",
    variables: {
      colorBackground: "transparent",
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div
          className="relative z-10 w-full max-w-xl bg-black border border-borderColor rounded-[10px] md:p-10 xsm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center mb-4
                                     transition-all duration-300
                                     
                                     "
          >
            <div className=""></div>

            <div className="sm:flex-1   ">
              <h1 className="sm:text-3xl xs:text-[24px] font-bold text-nowrap text-center">
                Update Payment Method
              </h1>
            </div>
          </div>
          <Placeholder height="250px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  if (!clientSecret) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-xl bg-black border border-borderColor rounded-[10px] md:p-10 xsm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <Elements
          stripe={stripePromise}
          //eslint-disable-next-line
          options={{ appearance, clientSecret } as any}
        >
          <UpdateForm
            setPaymentMethod={setPaymentMethod}
            onClose={onClose}
            clientSecret={clientSecret}
          />
        </Elements>
      </div>
    </div>
  );
};

export default UpdateSubscriptionModal;
