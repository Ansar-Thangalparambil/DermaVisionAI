import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import apiClient from "../../api/client"; // Fixed typo in apiClient

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DermatologistRegister = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full Name is required")
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name must not exceed 50 characters"),
    contactNo: Yup.string()
      .required("Contact Number is required")
      .matches(/^[0-9]{10}$/, "Contact Number must be 10 digits"),
    specialty: Yup.string().required("Specialty is required"),
    description: Yup.string()
      .required("Description is required")
      .min(20, "Description must be at least 20 characters"),
    portalLoginID: Yup.string()
      .required("Portal Login ID is required")
      .min(4, "Login ID must be at least 4 characters"),
    portalPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    imageUrl: Yup.string()
      .url("Please enter a valid URL")
      .required("Image URL is required"),
    availability: Yup.array()
      .of(
        Yup.object().shape({
          dayOfWeek: Yup.string().required("Day is required"),
          startTime: Yup.string().required("Start time is required"),
          endTime: Yup.string()
            .required("End time is required")
            .test(
              "is-after-start",
              "End time must be after start time",
              function (endTime) {
                const { startTime } = this.parent;
                return startTime < endTime;
              }
            ),
        })
      )
      .min(1, "At least one availability slot is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError("");
    try {
      console.log(values.availability);
      const response = await apiClient.post("/api/7788/postDermatologist", {
        fullName: values.fullName,
        contactNo: values.contactNo,
        specialty: values.specialty,
        description: values.description,
        portalLoginID: values.portalLoginID,
        portalPassword: values.portalPassword,
        imageUrl: values.imageUrl,
        availability: values.availability,
      });

      if (response.data) {
        alert("Registration Successful!");
        navigate("/login");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 w-full min-h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center overflow-y-auto">
          <div className="max-w-lg w-full">
            <h2 className="text-3xl font-semibold text-[#299392] mb-4">
              Dermatologist Registration
            </h2>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {apiError}
              </div>
            )}

            <Formik
              initialValues={{
                fullName: "",
                contactNo: "",
                specialty: "",
                description: "",
                portalLoginID: "",
                portalPassword: "",
                imageUrl: "",
                availability: [
                  {
                    dayOfWeek: "",
                    startTime: "",
                    endTime: "",
                  },
                ],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Full Name*
                      </label>
                      <Field
                        name="fullName"
                        className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                        placeholder="Dr. John Doe"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Contact Number*
                      </label>
                      <Field
                        name="contactNo"
                        type="tel"
                        className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                        placeholder="1234567890"
                      />
                      <ErrorMessage
                        name="contactNo"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Specialty*
                    </label>
                    <Field
                      name="specialty"
                      className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                      placeholder="e.g., Cosmetic Dermatology"
                    />
                    <ErrorMessage
                      name="specialty"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Description*
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full border-b-2 p-2 h-24 focus:border-[#299392] outline-none"
                      placeholder="Tell us about your expertise and experience"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Login ID*
                      </label>
                      <Field
                        name="portalLoginID"
                        className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                        placeholder="Choose a login ID"
                      />
                      <ErrorMessage
                        name="portalLoginID"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Password*
                      </label>
                      <Field
                        type="password"
                        name="portalPassword"
                        className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                        placeholder="Create a strong password"
                      />
                      <ErrorMessage
                        name="portalPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Profile Image URL*
                    </label>
                    <Field
                      name="imageUrl"
                      type="url"
                      className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                      placeholder="https://example.com/profile.jpg"
                    />
                    <ErrorMessage
                      name="imageUrl"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    {values.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={values.imageUrl}
                          alt="Profile Preview"
                          className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Availability*
                    </h3>
                    <FieldArray name="availability">
                      {({ push, remove }) => (
                        <div className="space-y-3">
                          {values.availability.map((_, index) => (
                            <div key={index} className="flex gap-2 items-end">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Day
                                </label>
                                <Field
                                  as="select"
                                  name={`availability.${index}.dayOfWeek`}
                                  className="w-full border p-2 rounded"
                                >
                                  <option value="">Select Day</option>
                                  {DAYS_OF_WEEK.map((day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Start Time
                                </label>
                                <Field
                                  type="time"
                                  name={`availability.${index}.startTime`}
                                  className="w-full border p-2 rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  End Time
                                </label>
                                <Field
                                  type="time"
                                  name={`availability.${index}.endTime`}
                                  className="w-full border p-2 rounded"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="bg-red-500 text-white px-3 py-2 rounded h-[42px]"
                                disabled={values.availability.length <= 1}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                dayOfWeek: "",
                                startTime: "",
                                endTime: "",
                              })
                            }
                            className="bg-[#299392] text-white px-4 py-2 rounded mt-2"
                          >
                            + Add Time Slot
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#299392] text-white py-3 rounded-lg hover:bg-[#1E6F6D] transition-colors mt-6"
                  >
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="bg-[#1E6F6D] rounded-xl flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Join Our Network</h2>
            <p className="text-xl mb-6 max-w-md">
              Connect with patients worldwide and grow your practice with our
              platform
            </p>
            <img
              src="/login.png"
              alt="Dermatologist Illustration"
              className="max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DermatologistRegister;
