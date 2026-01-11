import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";
import Placeholder from "../../../component/Placeholder/Placeholder";
import { useUser } from "../../../Context/UserContext";
import { Logger } from "../../../utils/Logger";

type Status = string;

export default function CheckoutForm({ choosePlan }: { choosePlan: string }) {
  const [paymentStatus, setPaymentStatus] = useState<Status | undefined | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const stripe = useStripe();
  const elements = useElements();
  const { setProfileData, profileData } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    let result;
    try {
      result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
    } catch (error) {
      toast.error(error as string);
     Logger("Error confirming payment:", error);
      return;
    }

    if (result?.paymentIntent?.status === "succeeded") {
      setPaymentStatus(result?.paymentIntent?.status);
      setProfileData({
        ...profileData!,
        subscriptionStatus: "active",
        subscriptionPlan: choosePlan,
      });
      toast.success("Payment successful");
    }
  };

  if (!stripe || !elements) {
    return (
      <div
        className="m-auto w-full 
          md:px-10
    xsm:px-4"
      >
        <Placeholder height="250px" borderRadius="8px" />
      </div>
    );
  }

  return (
    <>
      {!paymentStatus && (
        <div
          className="m-auto w-full 
          md:px-10
          xsm:px-4"
        >
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
                  options={{ layout: "accordion" }}
                  onReady={() => {
                    setTimeout(() => setIsLoading(false), 100);
                  }}
                  onLoadError={(error) => {
                    Logger("Error loading payment form:", error);
                    setIsLoading(false);
                    toast.error("Failed to load payment form");
                  }}
                />
              </div>
            </div>

            <button
              disabled={!stripe || isLoading}
              type="submit"
              className=" w-full hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Subscribe"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
