import React, { useState, useRef } from "react";
import { Upload, Info, X, File } from "lucide-react";

const NotesSection = ({ notes, setNotes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles([...selectedFiles, ...files]);
      setIsModalOpen(false); // Auto close the modal
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles([...selectedFiles, ...files]);
      setIsModalOpen(false); // Auto close the modal
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <>
      <h4 className="text-lg font-medium mt-6">Pre-Appointment Notes</h4>
      <p className="text-sm text-gray-600 mt-2">
        <Info size={16} className="inline mr-2" />
        Help your doctor understand your condition better by sharing your
        symptoms, concerns, and any relevant medical history before your
        appointment.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Share Your Symptoms & Concerns"
        className="w-full border border-gray-300 rounded-lg p-4 mt-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="mt-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-teal-600 hover:text-teal-700"
        >
          <Upload size={16} className="mr-1" />
          <span className="text-sm">Upload Image</span>
        </button>

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-3">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Selected Files:
            </h5>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-2 rounded"
                >
                  <File size={16} className="text-teal-600 mr-2" />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".jpg,.jpeg,.png"
        multiple
      />

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Why you feel</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Problem Input */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter your problems"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Upload Section */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Upload Photo</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Add your documents here, and you can upload up to 5 Mb
                </p>

                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-teal-200 rounded-lg p-8 text-center cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleBrowseClick}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Upload size={24} className="text-teal-600" />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Drag your file(s) or{" "}
                    <span className="text-blue-500">browse</span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Max 5 MB files are allowed
                  </p>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Only support .jpg, .png, img files
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesSection;
