import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/User/Sidebar";
import OrgHome from "../components/Organization/OrgHome";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import AccountSettings from "../components/User/AccountSettings";
import { Datepicker } from "flowbite-react";
import UserProfile from "../components/User/UserProfile";
import Activity from "../components/User/Activity";
import Results from "../components/User/Results";
import UserHome from "../components/User/UserHome";
import axios from "axios";

const UserDashboard = () => {
  const [status, setStatus] = useState("home");
  const { isAuthenticated, userDetails, setUserDetails } = useAppContext();

  const [selectedUser, setSelectedUser] = useState({});

  const navigate = useNavigate();

  const [language, setLanguage] = useState("All");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [blurBg, setBlurBg] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };
  const handleEndDate = (date) => {
    setEndDate(date);
  };

  return (
    <div className="flex h-screen w-screen relative">
      {/* Sidebar - Overlay on mobile, fixed on desktop */}
      <div
        className={`fixed lg:relative z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          status={status}
          setStatus={setStatus}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content - No translation, always in place */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="pl-4 lg:pl-[20px] w-full justify-between shadow-md h-[80px] items-center flex space-x-2 lg:space-x-[40px] pt-[14px] pb-[14px] pr-4 lg:pr-[20px] bg-white">
          {/* Left Section */}
          <div className="flex items-center space-x-2 lg:space-x-[40px]">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Credits Display - Activity Page */}
            {status == "activity" && (
              <div className="w-full sm:w-[230px] rounded-lg h-[50px] bg-[#D9E0E6] text-sm sm:text-[18px] pt-[10px] pl-[13px] pb-[10px] pr-[13px]">
                <h1 className="text-gray-600">
                  Credit available :{" "}
                  <span className="text-[#34856C]">{userDetails.credits}</span>
                </h1>
              </div>
            )}
          </div>

          {/* Center Section - Filters (Home Page Only) */}
          {status == "home" && (
            <div className="flex flex-row items-center space-x-2 sm:space-x-4 lg:space-x-[20px] flex-1 lg:flex-none justify-center">
              {/* Language Select */}
              <select
                onClick={() => setBlurBg(true)}
                className="rounded-lg focus:outline-none bg-gray-50 text-xs sm:text-sm w-20 sm:w-auto px-2 sm:px-3 py-1 sm:py-2"
                onChange={handleLanguage}
                value={language}
                id="lang"
                name="Language"
              >
                <option value="All">All</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
              </select>

              {/* Date Range - Horizontal Layout */}
              <div className="flex flex-row items-center space-x-2 lg:space-x-[20px]">
                <Datepicker
                  format="dd/MM/yyyy"
                  language="en"
                  maxDate={new Date(endDate)}
                  onChange={handleStartDate}
                  id="startDate"
                  icon={null}
                  className="w-16 sm:w-auto text-xs sm:text-sm"
                />
                <span className="text-xs sm:text-sm text-gray-500">to</span>
                <Datepicker
                  format="dd/MM/yyyy"
                  language="en"
                  minDate={new Date(startDate)}
                  onChange={handleEndDate}
                  maxDate={new Date()}
                  id="endDate"
                  icon={null}
                  className="w-16 sm:w-auto text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* Right Section - User Info */}
          <div className="flex space-x-[16px] items-center">
            <span
              className="font-bold text-sm sm:text-base"
              style={{ fontFamily: "Poppins" }}
            >
              Welcome {userDetails.userName.split(" ")[0]}
            </span>
            <button
              onClick={() => setStatus("settings")}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#34856C"
                stroke="#34856C"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-user-icon lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {status === "home" ? (
            <UserHome
              setStatus={setStatus}
              startDate={startDate}
              endDate={endDate}
              language={language}
            />
          ) : status === "activity" ? (
            <Activity setStatus={setStatus} />
          ) : status === "profile" ? (
            <UserProfile />
          ) : status === "settings" ? (
            <AccountSettings />
          ) : status === "results" ? (
            <Results status={status} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
