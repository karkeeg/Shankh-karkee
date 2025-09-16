import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import axios from "axios";
import toast from "react-hot-toast";
import Notifications from "../User/Notifications";

const AccountSettings = () => {
  const { userDetails, setUserDetails } = useAppContext();

  const [active, setActive] = useState("changePass");

  const [data, setData] = useState({
    _id: userDetails._id,
    oldPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log(data);
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userDetails);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/changeUserPassword`;
      const { data: res } = await axios.post(url, data);
      console.log(res.data);
      setUserDetails(res.data);
      toast.success(res.message);
      setData({
        _id: userDetails._id,
        oldPassword: "",
        newPassword: "",
      });
      setError("");
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        if (error.response.status >= 400 && error.response.status <= 500) {
          setError(error.response.data.message);
          console.log(error.response.data.message);
        }
      } else if (error.request) {
        // Request was made, but no response was received
        console.error("No response received from server", error.request);
        setError("Server is unreachable. Please try again later.");
      } else {
        // Something else caused the error
        console.error("Error:", error.message);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F8FAFA] overflow-y-scroll p-3 sm:p-4 lg:p-8 h-[89svh] w-full space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <h1
        style={{ fontFamily: "Poppins" }}
        className="font-semibold text-xl sm:text-2xl lg:text-[32px]"
      >
        Account Settings
      </h1>

      <div className="p-4 sm:p-6 lg:p-[40px] space-y-6 sm:space-y-8 lg:space-y-[30px] bg-white rounded-lg">
        <div
          style={{ fontFamily: "Poppins" }}
          className="font-semibold flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
        >
          <button
            type="button"
            className={`p-2 sm:p-3 text-sm sm:text-base ${
              active == "changePass"
                ? "border-b-2 sm:border-b-3 border-[#34856C] text-[#34856C]"
                : null
            }`}
            onClick={() => setActive("changePass")}
          >
            Change Password
          </button>
          <button
            type="button"
            className={`p-2 sm:p-3 text-sm sm:text-base ${
              active == "notifications"
                ? "border-b-2 sm:border-b-3 border-[#34856C] text-[#34856C]"
                : null
            }`}
            onClick={() => setActive("notifications")}
          >
            Notifications
          </button>
        </div>
        <div>
          {active === "changePass" ? (
            <div
              style={{ fontFamily: "Inter" }}
              className="space-y-6 sm:space-y-8 lg:space-y-[30px]"
            >
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-[14px]">
                <h3 className="font-semibold">Current Password</h3>
                <input
                  onChange={handleChange}
                  id="oldPassword"
                  value={data.oldPassword}
                  className="border-[1px] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34856C] focus:border-transparent w-full p-2 sm:p-3 text-sm sm:text-base"
                  placeholder="Enter current password"
                  type="password"
                />
              </div>

              <div className="space-y-1 sm:space-y-2 text-sm sm:text-[14px]">
                <h3 className="font-semibold">New Password</h3>
                <input
                  onChange={handleChange}
                  id="newPassword"
                  value={data.newPassword}
                  className="border-[1px] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34856C] focus:border-transparent w-full p-2 sm:p-3 text-sm sm:text-base"
                  placeholder="Enter new password"
                  type="password"
                />
              </div>

              <div className="space-y-1 sm:space-y-2 text-sm sm:text-[14px]">
                <h3 className="font-semibold">Confirm new password</h3>
                <input
                  onChange={handleChange}
                  id="confirmPassword"
                  value={data.confirmPassword}
                  className="border-[1px] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34856C] focus:border-transparent w-full p-2 sm:p-3 text-sm sm:text-base"
                  placeholder="Confirm new password"
                  type="password"
                />
              </div>

              <div className="font-semibold flex flex-col space-y-3 sm:space-y-4">
                {error && (
                  <span
                    style={{ fontFamily: "Poppins" }}
                    className="text-xs sm:text-sm text-red-600"
                  >
                    {error}
                  </span>
                )}
                <button
                  type="submit"
                  style={{ fontFamily: "Poppins" }}
                  className="w-full sm:w-auto py-2 sm:py-3 lg:pt-[10px] lg:pr-[53px] lg:pb-[10px] lg:pl-[53px] px-6 sm:px-12 lg:px-[53px] rounded-lg text-white bg-[#34856C] text-sm sm:text-base hover:bg-[#2d6b5a] transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          ) : (
            <Notifications />
          )}
        </div>
      </div>
    </form>
  );
};

export default AccountSettings;
