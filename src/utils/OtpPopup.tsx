import React, { useState } from 'react';
import './OtpPopup.css';

interface OtpPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const OtpPopup: React.FC<OtpPopupProps> = ({ isVisible, onClose }) => {
  const [otp, setOtp] = useState<string>('');

  const handleSubmitOtp = () => {
    // Handle OTP submission logic here
    console.log('OTP Submitted:', otp);
    onClose(); // Close popup after submission
  };

  return (
    isVisible ? (
      <div className="otp-popup">
        <div className="otp-popup-content">
          <h2>OTP Verification</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleSubmitOtp}>Verify OTP</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    ) : null
  );
};

export default OtpPopup;