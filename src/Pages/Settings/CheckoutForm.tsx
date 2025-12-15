import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";
import Placeholder from "../../component/Placeholder/Placeholder";

type Status = string;

export default function CheckoutForm() {
  const [paymentStatus, setPaymentStatus] = useState<Status | undefined | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setPaymentStatus(result?.paymentIntent?.status);
    console.log("Payment result:", result?.paymentIntent?.status);
    console.log(result);

    if (result.error) {
      toast(result.error.message);
    } else {
      toast("Payment Successful!");
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="m-auto w-full p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          User Preferences
        </h1>
        <Placeholder height="250px" borderRadius="8px" />
      </div>
    );
  }

  return (
    <>
      {!paymentStatus ? (
        <div className="m-auto w-full p-10">
          <h1 className="text-3xl font-bold mb-6 text-center">
            User Preferences
          </h1>

          <form onSubmit={handleSubmit} style={{ margin: "auto" }}>
            <div style={{ height: isLoading ? "250px" : "" }}>
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
                    console.error("PaymentElement load error:", error);
                    setIsLoading(false);
                    toast.error("Failed to load payment form");
                  }}
                />
              </div>
            </div>

            <div className="hover:bg-[#52535596] cursor-pointer flex justify-center p-2 rounded-lg mt-4 ">
              <button
                disabled={!stripe || isLoading}
                type="submit"
                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Pay $10"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="m-auto w-full p-10 text-center">
          <h1 className="text-3xl font-bold text-green-500">
            You are now a pro user! 🎉
          </h1>
        </div>
      )}
    </>
  );
}
