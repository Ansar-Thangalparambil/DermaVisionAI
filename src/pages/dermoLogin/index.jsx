import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiClent from "../../api/client";

const DermoLogin = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    portalLoginID: Yup.string().required("Login ID is required"),
    portalPassword: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError("");
    try {
      const response = await apiClent.post(
        "/api/7788/dermatologistLogin",
        {},
        {
          headers: {
            ID: values.portalLoginID,
            Password: values.portalPassword,
          },
        }
      );

      if (response.data) {
        // Store authentication token or user data if returned from API
        localStorage.setItem(
          "dermatologistToken",
          JSON.stringify(response.data.data)
        );

        // Redirect to dermatologist dashboard
        navigate("/dermotolgist");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("Login Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 w-full min-h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-semibold text-[#299392] mb-4">
              Dermatologist Login
            </h2>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {apiError}
              </div>
            )}

            <Formik
              initialValues={{
                portalLoginID: "",
                portalPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Login ID
                    </label>
                    <Field
                      name="portalLoginID"
                      className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                      placeholder="Enter your login ID"
                    />
                    <ErrorMessage
                      name="portalLoginID"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="portalPassword"
                      className="w-full border-b-2 p-2 focus:border-[#299392] outline-none"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="portalPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-[#299392] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#299392] text-white py-3 rounded-lg hover:bg-[#1E6F6D] transition-colors"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <a
                        href="/dermoRegister"
                        className="text-[#299392] hover:underline"
                      >
                        Register here
                      </a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="bg-[#1E6F6D] rounded-xl flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-xl mb-6 max-w-md">
              Access your dermatology portal and manage your patient
              appointments
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

export default DermoLogin;
