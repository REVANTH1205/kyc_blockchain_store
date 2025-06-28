// src/SharedInfo.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './SharedInfo.css'; // Import the updated CSS file

function SharedInfo() {
  const { encodedData } = useParams();
  
  // Decode the base64-encoded data
  const decodedData = atob(encodedData); // Decode the base64 string
  const user = JSON.parse(decodedData); // Parse the string back into an object

  return (
    <div className="shared-info-container">
      <div className="shared-info-modal">
        <h2>Shared User KYC Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Aadhaar:</strong> {user.aadhaar}</p>
        <p><strong>PAN:</strong> {user.pan}</p>

        <p className="verified-info">Verified: Yes</p>

        <div className="file-link">
          <p><strong>Aadhaar File:</strong></p>
          <a href={`https://gateway.pinata.cloud/ipfs/${user.aadhaarFileHash}`} target="_blank" rel="noopener noreferrer" download>
            <button>Download Aadhaar File</button>
          </a>
        </div>

        <div className="file-link">
          <p><strong>PAN File:</strong></p>
          <a href={`https://gateway.pinata.cloud/ipfs/${user.panFileHash}`} target="_blank" rel="noopener noreferrer" download>
            <button>Download PAN File</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SharedInfo;
