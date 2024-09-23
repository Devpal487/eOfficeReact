import React, { useState, useEffect, useRef } from "react";
import "./OtpPopup.css";
import api from "./Url";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import { useNavigate } from "react-router-dom";

interface OtpPopupProps {
  isVisible: boolean;
  onClose: () => void;
 
}

const TokenPopUp: React.FC<OtpPopupProps> = ({
  isVisible,
  onClose,
 
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(180);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (isVisible && !resendAvailable) {
      countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [isVisible, resendAvailable]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

//   const handleSubmitOtp = () => {
//     const otpString = otp.join("");
//     const collectData = { otp: otpString };
//     api
//       .post(`CertificateApply/VerificationOTP?id=${isId}`, JSON.stringify(collectData.otp), {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then(res => {
//         console.log(res.data); // Debug log
//         if (res.data.isSuccess) {
//           toast.success(res.data.mesg);
//           setTimeout(() => {
//             onOtpVerified(true);
//           onClose();
//           }, 800);
          
//         } else {
//           toast.error(res.data.mesg);
//           onOtpVerified(false);
//         }
//       })
//       .catch(err => {
//         toast.error("An error occurred while verifying OTP.");
//         console.error(err);
//       });
//   };

//   const handleResendOtp = () => {
//     const collectData = {
//       id: parseInt(isId) || 0,
//       name: isData.name || "",
//       rollNo: isData.rollNo || "",
//       mobileNo: isData.mobileNo || "",
//       emailId: isData.emailId || "",
//       dob: isData.dob || "",
//       otp: isData.otp || "",
//       certificateId: parseInt(isData.certificateId) || 0,
//       status: parseInt(isData.status) || 0,
//       address: isData.address || "",
//       aadharNo: parseInt(isData.aadharNo) || 0,
//       aadharImage: isData.aadharImage || "",
//     };

//     api.post(`CertificateApply/ResendOTP`, collectData)
//       .then(res => {
//         if (res.data.isSuccess) {
//           toast.success("OTP has been resent.");
//           setOtp(Array(6).fill(""));
//           setResendAvailable(false);
//           setTimer(120); // Reset timer
//         } else {
//           toast.error(res.data.mesg);
//         }
//       })
//       .catch(err => {
//         toast.error("An error occurred while resending OTP.");
//         console.error(err);
//       });
//   };

  return isVisible ? (
    <div className="otp-popup">
      <div className="otp-popup-content">
        <h2>
          <span className="otp-icon"></span>
          OTP Verification
        </h2>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              ref={el => inputRefs.current[index] = el}
              maxLength={1}
              className="otp-input"
              placeholder="-"
            />
          ))}
        </div>
        {/* <button className="verify" onClick={(e) => { e.preventDefault(); handleSubmitOtp(); }}> */}
        <button className="verify" onClick={() => {
            navigate('/AplicantService')
        }} >
          Verify OTP
        </button>
        <button className="close" onClick={onClose}>
          Close
        </button>
        {resendAvailable && (
        //   <button className="resend" onClick={(e) => { e.preventDefault(); handleResendOtp(); }}>
        <button className="resend" >
            Resend OTP
          </button>
        )}
        {!resendAvailable && timer > 0 && (
          <p>
            Resend available in {Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  ) : null;
};

export default TokenPopUp;