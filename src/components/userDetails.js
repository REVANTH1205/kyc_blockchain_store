// src/UserDetails.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './UserDetails.css';

function UserDetails() {
  const { state } = useLocation();
  const ipfsBase = "https://gateway.pinata.cloud/ipfs/";

  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState('initial'); // 'initial' | 'otpSent' | 'verified'
  const [publicLink, setPublicLink] = useState('');

  if (!state) return <p>No user data available.</p>;

  const sendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Log the OTP in the console for debugging
    console.log('Generated OTP:', newOtp);

    const templateParams = {
      to_email: state.email,
      to_name: state.name,
      otp_code: newOtp
    };

    emailjs.send('service_f5lick567', 'template_c0w75ea', templateParams, 'RW-hXbOHEK7gIkLJK')
      .then(() => {
        alert('OTP sent to your email!');
        setStep('otpSent');
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        alert('Failed to send OTP');
      });
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setStep('verified');
      const url = `${window.location.origin}/shared-info/${btoa(JSON.stringify(state))}`;
      setPublicLink(url);
    } else {
      alert('Incorrect OTP');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicLink);
    alert('Public link copied to clipboard!');
  };

  return (
    <div className="user-details-container" style={{ padding: '2rem' }}>
      <h2>User KYC Details</h2>
      <p><strong>Name:</strong> {state.name}</p>
      <p><strong>Email:</strong> {state.email}</p>
      <p><strong>Phone:</strong> {state.phone}</p>
      <p><strong>Aadhaar:</strong> {state.aadhaar}</p>
      <p><strong>PAN:</strong> {state.pan}</p>

      <div>
        <p><strong>Aadhaar File:</strong></p>
        <a href={`${ipfsBase}${state.aadhaarFileHash}`} target="_blank" rel="noopener noreferrer" download>
          <button>Download Aadhaar File</button>
        </a>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p><strong>PAN File:</strong></p>
        <a href={`${ipfsBase}${state.panFileHash}`} target="_blank" rel="noopener noreferrer" download>
          <button>Download PAN File</button>
        </a>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {step === 'initial' && <button onClick={sendOtp}>Verify</button>}
        {step === 'otpSent' && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Submit OTP</button>
          </div>
        )}
        {step === 'verified' && (
          <div>
             <p className="verified-info">Verified: Yes</p>

            <p><strong>Public Shareable Link:</strong></p>
            
            <button onClick={copyLink}>
              Copy Public Shareable Link
            </button>
            {/* <a href={publicLink} target="_blank" rel="noopener noreferrer">{publicLink}</a> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
