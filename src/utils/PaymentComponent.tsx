import React, { useEffect, useState } from "react";

// Extend the Window interface to include the 'Razorpay' property
interface WindowWithRazorpay extends Window {
  Razorpay?: any; // Define 'Razorpay' as 'any' or a more specific type if available
}

interface PaymentComponentProps {
  dispatchFee: number; 
  rate: number;
  netPayment: number;
 
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ dispatchFee, rate, netPayment, }) => {
    const [formattedAmount, setFormattedAmount] = useState<string>("");

    useEffect(() => {
        setFormattedAmount(`₹${netPayment.toFixed(2)}`);
        
        // Load the Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.addEventListener("load", () => {
            if ((window as WindowWithRazorpay).Razorpay) {
                const razorpayOptions = {
                    key: "rzp_test_UmUIzzSAIdrrTV", // Replace with your Razorpay Key
                    amount: netPayment * 100, // Amount in paise
                    currency: "INR",
                    name: "MSSPL",
                    description: `:
                                    Rate: ₹${rate.toFixed(2)},
                                    Dispatch Fee: ₹${dispatchFee.toFixed(2)}`,
                    handler: function (response: any) {
                        alert("Payment Successful");
                        console.log("Payment Details:", response);
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                        contact: "9999999999"
                    },
                    notes: {
                        address: "Customer Address"
                    },
                    theme: {
                        color: "#F37254"
                    }
                };

                // Create a new Razorpay instance and open the checkout
                const razorpay = new (window as WindowWithRazorpay).Razorpay(razorpayOptions);
                document.getElementById('razorpay-button-container')?.addEventListener('click', () => {
                    razorpay.open();
                });
            }
        });
        document.body.appendChild(script);
    }, [netPayment, dispatchFee, rate]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Payable Amount:</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formattedAmount}</p>
            <button id="razorpay-button-container" style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                Pay Now
            </button>
        </div>
    );
};

export default PaymentComponent;