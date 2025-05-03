import React from "react";

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phoneNo}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;