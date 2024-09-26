import React, { useEffect, useState } from "react";
import api from "./Url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WindowWithRazorpay extends Window {
  Razorpay?: any;
}

interface PaymentComponentProps {
  dispatchFee: number;
  rate: number;
  netPayment: number;
  isData: any;
  serviceId: number;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  dispatchFee,
  rate,
  netPayment,
  isData,
  serviceId,
}) => {
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false);

  const OrderItem = (paymentData: any, isSuccess: boolean) => {
    const collectData = {
      orderId: -1,
      serviceId: serviceId,
      rate: rate,
      dispatchFees: dispatchFee,
      paymentModeId: 1, // Assuming 1 is for Razorpay
      paymentModeName: "Razorpay",
      paymentDate: new Date().toISOString(),
      transactionId: paymentData.razorpay_payment_id,
      transactionIdName: "Payment ID",
      paymentBy: isData.name,
      netAmount: netPayment,
      orderNo: paymentData.razorpay_order_id,
      orderStatus: 0,
      transactionDate: new Date().toISOString(),
      paymentStatus: isSuccess ? 1 : 0,
      createdBy: "",
      updatedBy: "",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    };

    api
      .post(`OrderItem/AddUpdateOrderItem`, collectData)
      .then((res) => {
        console.log(res.data);
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
          setPaymentSuccessful(true);
        } else {
          toast.error(res.data.mesg);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("An error occurred while processing your request.");
      });
  };

  useEffect(() => {
    setFormattedAmount(`₹${netPayment.toFixed(2)}`);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.addEventListener("load", () => {
      if ((window as WindowWithRazorpay).Razorpay) {
        const razorpayOptions = {
          key: "rzp_test_UmUIzzSAIdrrTV",
          amount: netPayment * 100,
          currency: "INR",
          name: "MSSPL",
          description: `Rate: ₹${rate.toFixed(
            2
          )}, Dispatch Fee: ₹${dispatchFee.toFixed(2)}`,
          handler: function (response: any) {
            const isSuccess = !!response.razorpay_payment_id; 
            if (isSuccess) {
              alert("Payment Successful");
              console.log("Payment Details:", response);
              OrderItem(response, true); // Pass true for success
            } else {
              alert("Payment failed. Please try again.");
              OrderItem(response, false); // Pass false for failure
            }
          },
          prefill: {
            name: isData.name,
            email: isData.emailId,
            contact: isData.mobileNo,
          },
          notes: {
            address: isData.address,
          },
          theme: {
            color: "blue",
          },
        };

        const razorpay = new (window as WindowWithRazorpay).Razorpay(
          razorpayOptions
        );
        document
          .getElementById("razorpay-button-container")
          ?.addEventListener("click", () => {
            razorpay.open();
          });
      }
    });
    document.body.appendChild(script);
  }, [netPayment, dispatchFee, rate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {paymentSuccessful ? (
        <h2>Payment Successful</h2>
      ) : (
        <>
          <h2>Payable Amount:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {formattedAmount}
          </p>
          <button
            id="razorpay-button-container"
            style={{
              marginTop: "30px",
              padding: "15px 30px",
              fontSize: "18px",
              cursor: "pointer",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Pay Now
          </button>
        </>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default PaymentComponent;
