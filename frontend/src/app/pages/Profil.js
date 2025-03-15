"use client"; // Fix for Next.js

import { useState } from "react";
import { FaEdit, FaEnvelope } from "react-icons/fa";

const Profil = () => {
  // State to track edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    skills: "Project Management, Fundraising",
    tasks: "Food Distribution, Event Planning",
  });

  // Profile picture state
  const [profileImage, setProfileImage] = useState("/profile-pic.jpg"); // Default image path

  // Handle input change
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-6">
      <div className="w-[1000px] bg-white p-6 rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="relative bg-green-100 p-6 rounded-lg flex items-center justify-between">
          {/* Profile Picture & Info */}
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="relative w-16 h-16">
              <img
                src={profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()} // Click to change
              />
              {/* Hidden file input */}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Profile Info */}
            <div>
              <h2 className="text-xl font-semibold">{profileData.fullName}</h2>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>

          {/* Floating Edit Icon */}
          <div className="absolute top-4 right-4">
            <FaEdit
              className="text-gray-600 text-xl hover:text-gray-800 transition-all cursor-pointer shadow-lg p-2 rounded-full bg-white"
              title="Edit Profile"
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          {Object.entries(profileData).map(([key, value]) => (
            <div key={key}>
              <h3 className="font-semibold text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
                readOnly={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Update Button */}
        {isEditing && (
          <button
            className="w-full bg-green-500 text-white p-2 rounded-md mt-4 hover:bg-green-600 transition-all"
            onClick={() => setIsEditing(false)}
          >
            Update Profile
          </button>
        )}

        {/* Volunteer Stats */}
        <div className="mt-8">
          <h3 className="text-center font-semibold text-gray-800">Volunteer Stats</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
            {["Completed Events", "Hours Volunteered", "Most Active Month"].map((stat, index) => (
              <div key={index} className="bg-green-200 p-4 rounded-lg text-center w-full md:w-1/3">
                <h4 className="font-semibold">{stat}</h4>
                <p className="text-xl font-bold">
                  {index === 0 ? "10/15" : index === 1 ? "100/120" : "Ramadan 2024"}
                </p>
                <p className="text-gray-600 text-sm">
                  {index === 0
                    ? "You have completed 10 events"
                    : index === 1
                    ? "You have volunteered 100 hours"
                    : "8% increase from last month"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
