import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClent from "../api/client";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [editFormData, setEditFormData] = useState({
    userName: "",
    email: "",
    skinType: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Parse user info from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
        setEditFormData({
          userName: parsedUserInfo.FullName || "",
          email: parsedUserInfo.Email || "",
          skinType: parsedUserInfo.SkinType || "",
        });
        if (parsedUserInfo.ProfileImage) {
          setImagePreview(parsedUserInfo.ProfileImage);
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }

    // Close menu and modal when clicking outside
    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        isEditModalOpen
      ) {
        setEditModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [isEditModalOpen]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return null;

    try {
      const formData = new FormData();
      formData.append("file", profileImage);

      const response = await fetch(
        "https://asasul-islam-cggqcsa8a9dtghbq.eastus-01.azurewebsites.net/api/8002/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.imageUrl || data.url; // Return the image URL from response
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload image if a new one was selected
      let imageUrl = userInfo?.ProfileImage;
      if (profileImage) {
        imageUrl = await uploadImage();
      }

      // Update user profile with API using the correct format
      const updatedUserData = {
        userName: editFormData.userName,
        email: editFormData.email,
        skinType: editFormData.skinType,
        imageUrl: imageUrl,
      };

      // Use the correct API endpoint for updating user profile
      const response = await apiClent.put(
        "/api/7788/updateUserProfile",
        updatedUserData
      );

      if (response.status === 200) {
        // Update local storage with new user info, matching the original structure
        const updatedUserInfo = {
          ...userInfo,
          FullName: updatedUserData.userName,
          Email: updatedUserData.email,
          SkinType: updatedUserData.skinType,
          ProfileImage: updatedUserData.imageUrl,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo);
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (you could add state for error messages)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="min-h-[66px] sticky top-0 z-50 bg-white flex items-center justify-between px-[60px]">
        <img src="/logo.svg" alt="Logo" />

        <ul className="flex items-center text-sm justify-center font-medium gap-x-10">
          <Link to={"/"} className="hover:text-[#333333]/60 cursor-pointer">
            Home
          </Link>
          <Link
            to={"/appointments"}
            className="hover:text-[#333333]/60 cursor-pointer"
          >
            Appointments
          </Link>
          <Link to={"/help"} className="hover:text-[#333333]/60 cursor-pointer">
            Help
          </Link>
        </ul>

        <div className="flex gap-x-2 relative items-center justify-end">
          {userInfo ? (
            <>
              <div
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#D9D9D9] cursor-pointer overflow-hidden"
              >
                {userInfo.ProfileImage && (
                  <img
                    src={userInfo.ProfileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm hover:text-[#333333]/60 cursor-pointer"
            >
              Login
            </Link>
          )}

          {/* User menu */}
          {isMenuOpen && userInfo && (
            <div
              ref={menuRef}
              className="w-[230px] absolute border border-gray-200 rounded-lg shadow-md p-5 bg-white flex flex-col top-full mt-3 right-0"
            >
              {/* User info at the top of the menu */}
              <div className="flex flex-col items-center border-b border-b-[#DDDDDD] pb-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-[#D9D9D9] mb-3 overflow-hidden">
                  {userInfo.ProfileImage && (
                    <img
                      src={userInfo.ProfileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h4 className="text-[#333333] font-medium">
                  {userInfo?.FullName || "User"}
                </h4>
                <span className="text-xs text-[#333333] mt-1">
                  {userInfo?.Email || "user@example.com"}
                </span>
                {userInfo?.SkinType && (
                  <span className="text-xs text-[#299392] mt-1 bg-[#299392]/10 px-3 py-1 rounded-full">
                    {userInfo?.SkinType} Skin
                  </span>
                )}
              </div>

              {/* Menu options */}
              <ul className="w-full">
                <li
                  onClick={() => {
                    setEditModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center cursor-pointer py-4 border-b border-b-[#DDDDDD] gap-x-2 w-full"
                >
                  <img src="/icons/edit.svg" alt="Edit Profile" />
                  <span className="text-sm">Edit Profile</span>
                </li>
                <li
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer py-4 border-b border-b-[#DDDDDD] gap-x-2 w-full"
                >
                  <img src="/icons/logout.svg" alt="Logout" />
                  <span className="text-sm">Logout</span>
                </li>
                {/* <li
                  onClick={handleDeleteAccount}
                  className="flex items-center cursor-pointer py-4 gap-x-2 w-full"
                >
                  <img src="/icons/trash.svg" alt="Delete Account" />
                  <span className="text-sm text-[#EF4444]">Delete Account</span>
                </li> */}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-[#D9D9D9] mb-3 overflow-hidden relative">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <label
                    htmlFor="profile-image"
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <span className="text-white text-xs">Change</span>
                  </label>
                </div>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profile-image").click()
                  }
                  className="text-sm text-[#299392]"
                >
                  Upload Image
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={editFormData.userName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#299392]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#299392]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="skinType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skin Type
                  </label>
                  <select
                    id="skinType"
                    name="skinType"
                    value={editFormData.skinType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#299392]"
                  >
                    <option value="">Select Skin Type</option>
                    <option value="Normal">Normal</option>
                    <option value="Dry">Dry</option>
                    <option value="Oily">Oily</option>
                    <option value="Combination">Combination</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#299392] text-white py-2 rounded-md hover:bg-[#299392]/90 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
