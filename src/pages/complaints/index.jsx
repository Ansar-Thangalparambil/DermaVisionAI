import React, { useEffect, useState } from "react";
import apiClent from "../../api/client";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      return userInfo?.UserID;
    } catch (err) {
      console.error("Error getting user ID:", err);
      return null;
    }
  };

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Fetch all complaints for the current user
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const userId = getUserId();

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await apiClent.post(
        "/api/7788/getComplient",
        {},
        {
          headers: { UserID: userId },
        }
      );

      if (response.data && response.data.isSucess) {
        setComplaints(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch complaints");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        err.message || "Unable to load your complaints. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit a new complaint
  const submitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const userId = getUserId();

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      if (!complaintText.trim()) {
        throw new Error("Please enter your complaint.");
      }

      const response = await apiClent.post("/api/7788/postComplient", null, {
        headers: {
          UserID: userId,
          cmpText: complaintText,
        },
      });

      if (response.data.isSucess) {
        setSubmitSuccess(true);
        setComplaintText("");
        // Refresh the complaints list
        fetchComplaints();
      } else {
        throw new Error(response.data.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setSubmitError(
        err.message || "Unable to submit your complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine complaint status based on response
  const getComplaintStatus = (complaint) => {
    if (complaint.RespondedText) {
      return "Resolved";
    }
    return "Pending";
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6">Complaints</h1>

      {/* Submit New Complaint Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-medium mb-4">Submit New Complaint</h2>

        <form onSubmit={submitComplaint}>
          <div className="mb-4">
            <label
              htmlFor="complaint"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Complaint
            </label>
            <textarea
              id="complaint"
              rows="4"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Please describe your issue in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
              Your complaint has been submitted successfully.
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !complaintText.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isSubmitting || !complaintText.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      {/* Past Complaints List */}
      <div>
        <h2 className="text-lg font-medium mb-4">Your Complaint History</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-800 rounded-md">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 bg-gray-50 text-center text-gray-500 rounded-md border border-gray-200">
            You haven't submitted any complaints yet.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="break-words">
                    <p className="text-gray-700">
                      {complaint.CmpText || "No complaint text provided"}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="text-xs text-gray-500">
                      {formatDate(complaint.CreatedDate)}
                    </span>
                  </div>
                </div>

                {complaint.PatientName && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Patient: {complaint.PatientName}
                    </p>
                  </div>
                )}

                {complaint.RespondedText && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Response:
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {complaint.RespondedText}
                    </p>
                  </div>
                )}

                <div className="mt-2">
                  <span
                    className={`
                    px-2 py-1 text-xs rounded-full
                    ${
                      getComplaintStatus(complaint) === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  `}
                  >
                    {getComplaintStatus(complaint)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
