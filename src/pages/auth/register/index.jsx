import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiClent from "../../../api/client";
import { LuScanFace } from "react-icons/lu";

const Register = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full Name is required")
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name must not exceed 50 characters"),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),

    skinType: Yup.string()
      .required("Skin Type is required")
      .oneOf(
        ["Normal", "Dry", "Oily", "Combination", "Sensitive"],
        "Please select a valid skin type"
      ),
  });

  // Initial form values
  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    skinType: "", // Added skin type field
    rememberMe: false,
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setApiError(""); // Reset any previous API errors

    try {
      // Prepare the payload for the API
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        userType: "User", // Default user type, adjust as needed
        skinType: values.skinType, // Added skin type to payload
      };

      // Make API call to register
      const response = await apiClent.post("/api/7788/PostUsers", payload);

      // Handle successful registration
      if (response.data) {
        // Optional: Show success message or redirect
        alert("Registration Successful!");

        // Navigate to login page or dashboard
        navigate("/login");
      }
    } catch (error) {
      // Handle API errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.message ||
          "Registration failed. Please try again.";
        setApiError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setApiError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setApiError("An unexpected error occurred.");
      }
      console.error("Registration Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 w-full h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-2">
        <div className="flex flex-col items-center overflow-y-auto justify-center relative">
          <div className="max-w-lg w-full flex flex-col">
            <h4 className="text-3xl font-medium">Sign up</h4>
            <p className="mt-5">If you don't have an account register</p>
            <p className="mt-1">
              You can{" "}
              <Link to={"/login"} className="font-medium text-[#299392]">
                Login here !
              </Link>
            </p>

            {/* API Error Message */}
            {apiError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                <span className="block sm:inline">{apiError}</span>
              </div>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex flex-col mt-6 gap-y-2">
                  {/* Full Name Field */}
                  <div className="flex flex-col">
                    <label className="text-sm text-[#999999]">Full Name</label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="fullName"
                        className={`text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                          border-[#000842] p-3 ${
                            touched.fullName && errors.fullName
                              ? "border-red-500"
                              : "border-[#000842]"
                          }`}
                        placeholder="Enter your full name"
                      />
                      <img
                        src="/icons/user.svg"
                        alt=""
                        className="absolute top-4 my-auto left-2"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col">
                    <label className="text-sm text-[#999999]">Email</label>
                    <div className="relative">
                      <Field
                        type="email"
                        name="email"
                        className={`text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                          border-[#000842] p-3 ${
                            touched.email && errors.email
                              ? "border-red-500"
                              : "border-[#000842]"
                          }`}
                        placeholder="Enter your email address"
                      />
                      <img
                        src="/icons/email.svg"
                        alt=""
                        className="absolute top-4 my-auto left-2"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col">
                    <label className="text-sm text-[#999999]">Password</label>
                    <div className="relative">
                      <Field
                        type="password"
                        name="password"
                        className={`text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                          border-[#000842] p-3 ${
                            touched.password && errors.password
                              ? "border-red-500"
                              : "border-[#000842]"
                          }`}
                        placeholder="Enter your Password"
                      />
                      <img
                        src="/icons/lock.svg"
                        alt=""
                        className="absolute top-3 my-auto left-2"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col mt-6">
                    <label className="text-sm text-[#999999]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type="password"
                        name="confirmPassword"
                        className={`text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                          border-[#000842] p-3 ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "border-red-500"
                              : "border-[#000842]"
                          }`}
                        placeholder="Confirm your Password"
                      />
                      <img
                        src="/icons/lock.svg"
                        alt=""
                        className="absolute top-4 my-auto left-2"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Skin Type Field */}
                  <div className="flex flex-col mt-6">
                    <label className="text-sm text-[#999999]">Skin Type</label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="skinType"
                        className={`text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                          border-[#000842] p-3 ${
                            touched.skinType && errors.skinType
                              ? "border-red-500"
                              : "border-[#000842]"
                          }`}
                      >
                        <option value="">Select your skin type</option>
                        <option value="Normal">Normal</option>
                        <option value="Dry">Dry</option>
                        <option value="Oily">Oily</option>
                        <option value="Combination">Combination</option>
                        <option value="Sensitive">Sensitive</option>
                      </Field>
                      <LuScanFace className="absolute top-4 my-auto left-2" />

                      <ErrorMessage
                        name="skinType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-x-2 mt-4">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="border-2"
                    />
                    <span className="font-light text-sm">Remember me</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-4 rounded-4xl bg-[#299392] text-white font-medium hover:bg-[#1E6F6D] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Right Side (Unchanged) */}
        <div className="bg-[#1E6F6D] relative rounded-xl flex items-center justify-center flex-col">
          <div className="w-full h-full max-w-lg flex flex-col items-center justify-center">
            <img
              src="/login.png"
              alt=""
              className="w-full max-w-[440px] object-contain"
            />
            <div className="flex flex-col mt-7 w-full items-start">
              <h3 className="text-white text-3xl font-semibold">
                Sign Up to MedExpert
              </h3>
              <p className="font-extralight mt-2 text-white">
                Health starts here. Create your account today!
              </p>
            </div>
          </div>
          <img src="/logoWhite.svg" alt="" className="absolute top-7 left-10" />
        </div>
      </div>
    </main>
  );
};

export default Register;
