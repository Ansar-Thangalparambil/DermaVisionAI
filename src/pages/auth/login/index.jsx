import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiClent from "../../../api/client";

const Login = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),

    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  // Handle login submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError(""); // Reset any previous API errors

    if (values.email === "admin@gmail.com" && values.password === "admin123") {
      localStorage.setItem("isAdminLogin", true);
      return navigate("/dashboard");
    }

    try {
      // Prepare the payload for the API
      const payload = {
        email: values.email,
        password: values.password,
      };

      // Make API call to login
      const response = await apiClent.post("/api/7788/UserLogin", payload);

      // Handle successful login
      if (response.data) {
        // Store token or user info in localStorage if needed
        localStorage.setItem("userToken", response.data.token || "");
        localStorage.setItem("userInfo", JSON.stringify(response.data.data[0]));

        // Navigate to dashboard or home page
        navigate("/");
      }
    } catch (error) {
      // Handle API errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.message || "Login failed. Please try again.";
        setApiError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setApiError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setApiError("An unexpected error occurred.");
      }
      console.error("Login Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 w-full h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-2">
        <div className="flex items-center justify-center relative">
          <div className="max-w-lg w-full flex flex-col">
            <h4 className="text-3xl font-medium">Sign in</h4>
            <p className="mt-5">If you don't have an account register</p>
            <p className="mt-1">
              You can{" "}
              <Link to={"/register"} className="font-medium text-[#299392]">
                Register here !
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
                <Form className="flex flex-col mt-12 gap-y-6">
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
                        className="absolute top-4 left-2 my-auto"
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
                        className="absolute top-4 left-2 my-auto"
                      />
                      <ErrorMessage
                        name="password"
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
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Right Side (Unchanged) */}
        <div className="bg-[#1E6F6D] rounded-xl relative flex items-center justify-center flex-col">
          <div className="w-full h-full max-w-lg flex flex-col items-center justify-center">
            <img
              src="/login.png"
              alt=""
              className="w-full max-w-[440px] object-contain"
            />
            <div className="flex flex-col mt-7 w-full items-start">
              <h3 className="text-white text-3xl font-semibold">
                Sign in to MedExpert
              </h3>
              <p className="font-extralight mt-2 text-white">
                Welcome back! Let's book your next <br /> appointment
                effortlessly.
              </p>
            </div>
          </div>
          <img src="/logoWhite.svg" alt="" className="absolute top-7 left-10" />
        </div>
      </div>
    </main>
  );
};

export default Login;
