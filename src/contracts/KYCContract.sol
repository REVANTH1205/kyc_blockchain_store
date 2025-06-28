// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; // Add this line to enable the ABIEncoderV2 feature

contract KYCContract {
    struct User {
        string name;
        string email;
        string phone;
        string dob;
        string aadhaar;
        string pan;
        string aadhaarFileHash;
        string panFileHash;
        bool isRegistered;
    }

    // Struct to group KYC details
    struct UserDetails {
        string name;
        string email;
        string phone;
        string dob;
        string aadhaar;
        string pan;
        string aadhaarFileHash;
        string panFileHash;
    }

    mapping(address => User) public users;

    event UserRegistered(
        address indexed userAddress,
        string name,
        string email,
        string phone,
        string dob,
        string aadhaar,
        string pan,
        string aadhaarFileHash,
        string panFileHash
    );

    modifier onlyUnregistered() {
        require(!users[msg.sender].isRegistered, "User already registered");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    // Register a new user with all required information and file hashes
    function registerUser(
        UserDetails memory _userDetails
    ) public onlyUnregistered {
        _storeUserData(_userDetails);
        emit UserRegistered(
            msg.sender,
            _userDetails.name,
            _userDetails.email,
            _userDetails.phone,
            _userDetails.dob,
            _userDetails.aadhaar,
            _userDetails.pan,
            _userDetails.aadhaarFileHash,
            _userDetails.panFileHash
        );
    }

    // Internal function to store the user's KYC information in the mapping
    function _storeUserData(
        UserDetails memory _userDetails
    ) internal {
        users[msg.sender] = User({
            name: _userDetails.name,
            email: _userDetails.email,
            phone: _userDetails.phone,
            dob: _userDetails.dob,
            aadhaar: _userDetails.aadhaar,
            pan: _userDetails.pan,
            aadhaarFileHash: _userDetails.aadhaarFileHash,
            panFileHash: _userDetails.panFileHash,
            isRegistered: true
        });
    }

    // Function to update the user's details (only after registration)
    function updateUserDetails(
        UserDetails memory _userDetails
    ) public onlyRegistered {
        _storeUserData(_userDetails);
    }

    // Function to get the user's information
    function getUserInfo(address _user) public view returns (
        string memory name,
        string memory email,
        string memory phone,
        string memory dob,
        string memory aadhaar,
        string memory pan,
        string memory aadhaarFileHash,
        string memory panFileHash
    ) {
        User memory user = users[_user];
        return (
            user.name,
            user.email,
            user.phone,
            user.dob,
            user.aadhaar,
            user.pan,
            user.aadhaarFileHash,
            user.panFileHash
        );
    }
}
