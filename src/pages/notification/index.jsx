import React, { useState, useEffect } from "react";
import apiClent from "../../api/client";

const Feedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Function to fetch complaints from API using axios
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiClent.post("/api/7788/getComplient");

      if (response.data.isSucess) {
        setComplaints(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch complaints");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to open modal with specific complaint
  const openResponseModal = (complaint) => {
    setSelectedComplaint(complaint);
    setResponseText("");
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setResponseText("");
  };

  // Function to submit response using axios
  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!responseText.trim()) return;

    try {
      setSubmitting(true);

      const response = await apiClent.put(
        "/api/7788/putComplient",
        {},
        {
          headers: {
            cmpID: selectedComplaint.ComplientID,
            rspTxt: responseText,
          },
        }
      );

      if (response.data.isSucess) {
        setSubmitSuccess(true);
        // Refresh complaints list
        fetchComplaints();
        // Close modal after short delay
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to submit response");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error submitting response:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Show loading state
  if (loading && complaints.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error && complaints.length === 0) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchComplaints}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Patient Complaints
      </h1>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.ComplientID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.ComplientID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.PatientName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {complaint.CmpText || "No text provided"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.CreatedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          complaint.RespondedText
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {complaint.RespondedText ? "Responded" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openResponseModal(complaint)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                      >
                        {complaint.RespondedText
                          ? "View/Edit Response"
                          : "Respond"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden">
            <div className="bg-blue-500 text-white px-6 py-4">
              <h3 className="text-lg font-medium">
                Respond to Complaint #{selectedComplaint.ComplientID}
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Patient:</p>
                <p className="font-medium">
                  {selectedComplaint.PatientName || "Unknown"}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Complaint Text:</p>
                <p className="p-3 bg-gray-50 rounded border border-gray-200">
                  {selectedComplaint.CmpText || "No text provided"}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Date Submitted:</p>
                <p>{formatDate(selectedComplaint.CreatedDate)}</p>
              </div>

              {selectedComplaint.RespondedText && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Previous Response:</p>
                  <p className="p-3 bg-gray-50 rounded border border-gray-200">
                    {selectedComplaint.RespondedText}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitResponse}>
                <div className="mb-4">
                  <label
                    htmlFor="responseText"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Response:
                  </label>
                  <textarea
                    id="responseText"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your response here..."
                    required
                  />
                </div>

                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    Response submitted successfully!
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      submitting
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Response"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
