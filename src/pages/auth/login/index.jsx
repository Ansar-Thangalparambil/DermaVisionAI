import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/");
  };
  return (
    <main className="p-5 w-full h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-2 ">
        <div className="flex items-center justify-center relative">
          <div className="max-w-lg w-full flex flex-col ">
            <h4 className="text-3xl font-medium">Sign in</h4>
            <p className="mt-5">If you don’t have an account register</p>
            <p className="mt-1">
              You can{" "}
              <Link to={"/register"} className="font-medium text-[#299392]">
                Register here !
              </Link>
            </p>
            <form className="flex flex-col mt-12 gap-y-6">
              <div className="flex flex-col">
                <label className="text-sm text-[#999999]">Email</label>
                <div className="relative">
                  <input
                    type="text"
                    className="text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                      border-[#000842] p-3"
                    placeholder="Enter your email address"
                  />
                  <img
                    src="/icons/email.svg"
                    alt=""
                    className="absolute top-0 bottom-0 my-auto  "
                  />
                </div>
              </div>
              <div>
                {" "}
                <div className="flex flex-col">
                  <label className="text-sm text-[#999999]">Password</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="text-sm placeholder-[#000842] pl-10 border-b-2 w-full outline-none
                      border-[#000842] p-3"
                      placeholder="Enter your Password"
                    />
                    <img
                      src="/icons/lock.svg"
                      alt=""
                      className="absolute top-0 bottom-0 my-auto  "
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2 mt-4">
                  <input type="checkbox" className="border-2" />
                  <span className="font-light text-sm">Rememebr me</span>
                </div>
              </div>
              <button
                onClick={handleLogin}
                className="py-4 rounded-4xl bg-[#299392] text-white font-medium"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="bg-[#1E6F6D] rounded-xl relative flex items-center justify-center flex-col">
          <div className="w-full h-full  max-w-lg flex flex-col items-center justify-center">
            <img
              src="/login.png"
              alt=""
              className="w-full max-w-[440px] object-contain "
            />
            <div className="flex flex-col mt-7  w-full items-start">
              <h3 className="text-white text-3xl font-semibold">
                Sign in to xpert
              </h3>
              <p className="font-extralight mt-2  text-white">
               Welcome Back! Get Personalized Skin Insights with  <br /> DermaVision AI ✨
              </p>
            </div>
          </div>
          <img src="/DermaVisionLogoWhite.svg" alt="" className="absolute top-7 left-10" />
        </div>
      </div>
    </main>
  );
};

export default Login;
