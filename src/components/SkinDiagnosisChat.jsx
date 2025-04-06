import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import apiClent from "../api/client";

const SkinDiagnosisChat = () => {
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "system",
      content: "Welcome to Skin Diagnosis. Upload an image to get started.",
    },
  ]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Camera handling
  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showCameraModal]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      addMessage(
        "system",
        "Could not access camera. Please check permissions."
      );
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", {
              type: "image/jpeg",
            });
            setSelectedImage(file);
            setShowCameraModal(false);
            addMessage("user", "Image captured from camera");
            processSkinImage(file);
          }
        },
        "image/jpeg",
        0.9
      );
    }
  };

  // Add message to chat
  const addMessage = (type, content) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type, content, timestamp: new Date() },
    ]);
  };

  // Process and diagnose skin image
  const processSkinImage = async (imageFile) => {
    setIsProcessingImage(true);
    addMessage("system", "Analyzing your skin image...");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Add a slight delay to ensure the loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await apiClent.post("/api/7788/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        const diagnosisResult =
          response.data.description || "No diagnosis available";
        addMessage("diagnosis", diagnosisResult);
      } else {
        throw new Error("Failed to diagnose skin image");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      addMessage("system", "Failed to analyze skin image. Please try again.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Upload image handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      addMessage("user", "Image uploaded");
      processSkinImage(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Open camera modal
  const openCamera = () => {
    setShowCameraModal(true);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-40"
        aria-label="Skin Diagnosis Chat"
      >
        {isOpen ? (
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
        ) : (
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
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-full max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-40 overflow-hidden flex flex-col animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h3 className="font-semibold">Skin Diagnosis Assistant</h3>
            <button onClick={toggleChat} className="hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : message.type === "diagnosis"
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-gray-100 rounded-bl-none"
                  }`}
                >
                  {message.type === "diagnosis" && (
                    <p className="font-medium text-red-800 mb-1">
                      Diagnosis Result:
                    </p>
                  )}
                  <p>{message.content}</p>
                  {message.timestamp && (
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {selectedImage && (
              <div className="mb-4 flex justify-end">
                <div className="max-w-xs bg-gray-100 rounded-lg p-2 border border-gray-200">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Uploaded"
                    className="w-full h-auto rounded"
                    onLoad={() => URL.revokeObjectURL(selectedImage)}
                  />
                </div>
              </div>
            )}
            {isProcessingImage && (
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Actions Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <button
                onClick={triggerFileInput}
                disabled={isProcessingImage}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Image
              </button>
              <button
                onClick={openCamera}
                disabled={isProcessingImage}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Camera
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn overflow-hidden">
            <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
              <h3 className="font-medium">Take a Photo of Your Skin</h3>
              <button
                onClick={() => setShowCameraModal(false)}
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

            <div className="relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="p-4 bg-gray-50 flex justify-center">
              <button
                onClick={captureImage}
                className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkinDiagnosisChat;
