import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClent from "../../api/client";
import { Trash2 } from "lucide-react";

const GET_USERS_ENDPOINT = "/api/7788/getUsers";
const DELETE_USER_ENDPOINT = "/api/7788/deleteUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage for authorization (if needed)
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.UserID;

      const response = await apiClent.get(GET_USERS_ENDPOINT);

      if (response.data && response.data.isSucess) {
        setUsers(response.data.data || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Unable to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, event) => {
    // Stop propagation to prevent navigation
    event.stopPropagation();

    if (!userId) return;

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeleting(userId);

    try {
      const response = await apiClent.delete(DELETE_USER_ENDPOINT, {
        headers: {
          userID: userId,
        },
      });

      if (response.data && response.data.isSucess) {
        // Remove the user from the state
        setUsers(users.filter((user) => user.UserID !== userId));
      } else {
        throw new Error(response.data?.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message || "Unable to delete user. Please try again later.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-800 rounded-md">{error}</div>
      ) : users.length === 0 ? (
        <div className="p-12 bg-gray-50 text-center text-gray-500 rounded-md border border-gray-200">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <User
              key={user.UserID || index}
              user={user}
              onDelete={handleDeleteUser}
              isDeleting={deleting === user.UserID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const User = ({ user, onDelete, isDeleting }) => {
  const navigate = useNavigate();

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "N/A";
    }
  };

  // Determine user type styling
  const getUserTypeStyle = (userType) => {
    const type = userType?.toLowerCase() || "user";

    if (type === "admin") {
      return "bg-purple-100 text-purple-800";
    } else if (type === "user") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-5 py-7 flex flex-col relative cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Delete Button */}
      <button
        onClick={(e) => onDelete(user.UserID, e)}
        disabled={isDeleting}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
        title="Delete User"
      >
        {isDeleting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-500"></div>
        ) : (
          <Trash2 size={18} />
        )}
      </button>

      <div className="mb-3">
        {user.ImageUrl ? (
          <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
            <img
              src={user.ImageUrl}
              alt={`User ${user.FullName}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mb-2"></div>
        )}
        <h3 className="text-lg font-medium text-gray-800 pr-8">
          {user.FullName || "Unknown User"}
        </h3>
        <div className="flex mt-2 gap-2">
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              user.IsActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.IsActive ? "Active" : "Inactive"}
          </span>

          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${getUserTypeStyle(
              user.UserType
            )}`}
          >
            {user.UserType || "User"}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1">{user.Email || "No email provided"}</p>
        <p>Registered: {formatDate(user.CreatedAt)}</p>
        <p>skinType: {user.SkinType}</p>
      </div>
    </div>
  );
};

export default Users;
