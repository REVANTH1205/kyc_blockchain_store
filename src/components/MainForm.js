import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import KYCContract from '../abis/KYCContract.json'; // you'll need to generate this using Truffle compile
import axios from 'axios';  // Ensure axios is installed
import { useHistory  } from 'react-router-dom';


import './MainForm.css';

function MainForm() {
  const [account, setAccount] = useState('');
  const [kycContract, setKycContract] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userDOB, setUserDOB] = useState('');
  const [userAadhaar, setUserAadhaar] = useState('');
  const [userPAN, setUserPAN] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    console.log('Loading blockchain data...');
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log('Ethereum enabled');

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = KYCContract.networks[networkId];

      if (networkData) {
        const contract = new web3.eth.Contract(KYCContract.abi, networkData.address);
        setKycContract(contract);
        console.log('KYC Contract loaded at:', networkData.address);
      } else {
        alert('Smart contract not deployed to the detected network.');
        console.error('Smart contract not deployed on this network:', networkId);
      }
    } else {
      alert('Please install MetaMask to use this app.');
      console.error('MetaMask not found');
    }
  };

  const uploadFileToPinata = async (file) => {
    console.log('Uploading file to Pinata:', file.name);
    const formData = new FormData();
    formData.append("file", file);
   
    try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        pinata_api_key: "PINATA_API_KEY",
        pinata_secret_api_key: "PINATA_SECRET _KEY ",
      },
    });
    console.log('File uploaded to IPFS. Hash:', res.data.IpfsHash);
    return res.data.IpfsHash;
  } catch (err) {
    console.error('Error uploading file to Pinata:', err);
    throw err;
  }
  };

  const registerUser = async () => {
    if (!aadhaarFile || !panFile) {
      alert('Please upload both Aadhaar and PAN card files.');
      console.warn('User tried to register without uploading both files.');
      return;
    }

    setLoading(true);
    console.log('Registering user...');


    try {
      const aadhaarHash = await uploadFileToPinata(aadhaarFile);
      const panHash = await uploadFileToPinata(panFile);

      const userDetails = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        dob: userDOB,
        aadhaar: userAadhaar,
        pan: userPAN,
        aadhaarFileHash: aadhaarHash,
        panFileHash: panHash,
      };

      console.log('Sending user details to smart contract:', userDetails);
      await kycContract.methods.registerUser(userDetails).send({ from: account });
      console.log('User registered successfully on blockchain.');
      alert('User registered successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error registering user: ', err);
      setLoading(false);
      alert('Error during registration!');
    }
  };

  const fetchUser = async () => {
    if (kycContract) {
      console.log('Fetching user data from blockchain...');
      try {
        const result = await kycContract.methods.getUserInfo(account).call();
        console.log('Fetched user data:', result);
  
        history.push('/user-details', {
            ...result,
            aadhaarFileHash: result.aadhaarFileHash,
            panFileHash: result.panFileHash,
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Error fetching user data');
      }
    }
  };
  return (
    <div className="app-container">
      <h2>KYC DApp</h2>
      <p><strong>Connected Account:</strong> {account}</p>

      <div className="form-group">
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your phone number"
          value={userPhone}
          onChange={e => setUserPhone(e.target.value)}
        />
        <input
          type="date"
          placeholder="Enter your date of birth"
          value={userDOB}
          onChange={e => setUserDOB(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Aadhaar number"
          value={userAadhaar}
          onChange={e => setUserAadhaar(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your PAN number"
          value={userPAN}
          onChange={e => setUserPAN(e.target.value)}
        />
      <div className="form-group">
        <label>
            <strong>Upload Aadhaar card File:</strong>
            <input
            type="file"
            accept="image/*"
            onChange={e => setAadhaarFile(e.target.files[0])}
            />
        </label>
        </div>

        <div className="form-group">
        <label>
            <strong>Upload PAN card File:</strong>
            <input
            type="file"
            accept="image/*"
            onChange={e => setPanFile(e.target.files[0])}
            />
        </label>
        </div>

        <button onClick={registerUser} disabled={loading}>
          {loading ? 'Uploading Data...' : 'Upload User Data'}
        </button>
      </div>

      <div className="form-group">
        <button onClick={fetchUser}>Show User Data</button>
      </div>
    </div>
  );
}
export default MainForm;
