import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";
import Placeholder from "../../../component/Placeholder/Placeholder";
import { FaArrowLeftLong } from "react-icons/fa6";
import axiosClient from "../../../api/axiosClient";
// import axiosClient from "../../api/axiosClient";

// type Status = string;
type updateFormProps = {
  clientSecret: string;
  onClose: () => void;
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<paymentMethodtype | null>
  >;
};

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
export default function UpdateForm({
  clientSecret,
  onClose,
  setPaymentMethod,
}: updateFormProps) {
  // const [paymentStatus, setPaymentStatus] = useState<Status | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      await elements.submit();
      const paymentResult = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
      });
      setLoading(false);
      if (paymentResult.setupIntent?.status === "succeeded") {
        try {
          axiosClient
            .post("/update-method-payment", {
              paymentMethodId: paymentResult.setupIntent.payment_method,
            })
            .then((res) => {
              toast("Payment Updated Successfully!");
              setPaymentMethod(res.data.paymentMethod);
              onClose();
            })
            .catch((error) => {
              console.error("Error updating payment method on server:", error);
              toast.error("Failed to update payment method on server.");
            });
        } catch (error) {
          onClose();
          console.error("Error in updating payment method:", error);
        }
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  if (!stripe || !elements) {
    return (
      <div
        className="m-auto w-full 
          md:p-10
    xsm:p-4"
      >
        <div className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity" />
        <div className="m-auto w-full md:p-10 xsm:p-4 bg-black">
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
                Update Payment Method
              </h1>
            </div>
          </div>
          <Placeholder height="250px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  return (
    <>
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
              Update Payment Method
            </h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ margin: "auto" }}>
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
            >
              <PaymentElement
                options={{ paymentMethodOrder: ["card"] }}
                onReady={() => {
                  setTimeout(() => setIsLoading(false), 100);
                }}
                onLoadError={(error) => {
                  console.error("PaymentElement load error:", error);
                  setIsLoading(false);
                  toast.error("Failed to load payment form");
                }}
              />
            </div>
          </div>

          <button
            disabled={!stripe || isLoading}
            type="submit"
            className=" disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg mt-4 w-full"
          >
            {loading ? "Loading..." : "Update payment method"}
          </button>
        </form>
      </div>
    </>
  );
}
