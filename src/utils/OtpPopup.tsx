import React, { useState, useEffect } from "react";
import "./OtpPopup.css";
import api from "./Url";
import { toast, ToastContainer } from "react-toastify";

interface OtpPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onOtpVerified: (isVerified: boolean) => void;
  isId: any;
  isData:any;
}

const OtpPopup: React.FC<OtpPopupProps> = ({
  isVisible,
  onClose,
  onOtpVerified,
  isId,
  isData
}) => {
  const [otp, setOtp] = useState<any>();
  console.log("otp", otp);
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>(5);

  

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (isVisible && !resendAvailable) {
      countdown = setInterval(() => {
        setTimer((prev: any) => {
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

 

  const handleSubmitOtp = () => {
    const collectData = { otp };
    console.log(collectData.otp);

    api
      .post(
        `CertificateApply/VerificationOTP?id=${isId}`,
        JSON.stringify(collectData.otp),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
          onOtpVerified(true);
          onClose();
        } else {
          alert(res.data.mesg);
          onOtpVerified(false);
        }
      });
    console.log("OTP Submitted:", otp);
  };

  const handleResendOtp = () => {
    const collectData ={
      id: parseInt(isId)||0, 
      name: isData.name ||"",
      rollNo: isData.rollNo ||"",
      mobileNo: isData.mobileNo ||"",
      emailId: isData.emailId ||"",
      dob:isData.dob ||"",
      otp: isData.otp ||"",
      certificateId:parseInt(isData.certificateId)||0,
      status: parseInt(isData.status) || 0,
      address: isData.address ||"",
      aadharNo: parseInt(isData.aadharNo) ||0,
      aadharImage: isData.aadharImage ||"",
    };

    api.post(`CertificateApply/ResendOTP`, collectData).then((res) => {
      if (res.data.isSuccess) {
        alert("OTP has been resent.");
        setResendAvailable(false);
        setTimer(60); // Reset timer
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  return isVisible ? (
    <div className="otp-popup">
      <div className="otp-popup-content">
        <h2>OTP Verification</h2>
        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button
          onClick={(e) => {
            handleSubmitOtp();
            e.preventDefault();
          }}
        >
          Verify OTP
        </button>
        <button onClick={onClose}>Close</button>
        {resendAvailable && (
          <button onClick={(e) =>{handleResendOtp()
            e.preventDefault();
          }}>Resend OTP</button>
        )}
        {!resendAvailable && timer > 0 && (
          <p>
            Resend available in {Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </p>
        )}
      </div>
    </div>
  ) : null;
};

export default OtpPopup;
