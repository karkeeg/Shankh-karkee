import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";
import Logo2 from "../assets/Logo2.png";
import OrgHome from "../components/Organization/OrgHome";
import AccountSettings from "../components/User/AccountSettings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserProfile from "../components/User/UserProfile";
import Activity from "../components/User/Activity";
import Results from "../components/User/Results";
import UserHome from "../components/User/UserHome";

const Sidebar = ({ status, setStatus, sidebarOpen, setSidebarOpen }) => {
  const { setIsAuthenticated } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const handleCloseSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleNavigation = (newStatus) => {
    setStatus(newStatus);
    // Close sidebar on mobile after navigation
    if (setSidebarOpen && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        style={{ fontFamily: "Poppins" }}
        className={`fixed top-0 left-0 h-full lg:relative font-semibold w-[280px] flex-shrink-0 flex flex-col p-6 text-white bg-[#34856C] z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0 shadow-lg"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col space-y-8 flex-1">
          {/* Header with Logo and Close Button */}
          <div className="flex justify-between items-center">
            <img className="w-32 h-auto" src={Logo2} alt="Logo" />
            {/* Close Button - Visible on mobile, hidden on desktop */}
            <button
              onClick={handleCloseSidebar}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => handleNavigation("home")}
            className={`flex items-center w-full p-3 space-x-3 rounded-lg transition-colors ${
              status === "home"
                ? "bg-white text-gray-900 shadow-md"
                : "text-white hover:bg-white hover:bg-opacity-10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house-icon lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigation("profile")}
            className={`flex rounded-lg space-x-2 p-[7.51px] items-center text-sm sm:text-base ${
              status == "profile" || status == "addUser" || status == "editUser"
                ? "bg-[white] text-black "
                : null
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users-icon lucide-users"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleNavigation("activity")}
            className={`flex rounded-lg space-x-2 p-[7.51px] items-center text-sm sm:text-base ${
              status == "activity" ? "bg-[white] text-black " : null
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-audio-lines-icon lucide-audio-lines"
            >
              <path d="M2 10v3" />
              <path d="M6 6v11" />
              <path d="M10 3v18" />
              <path d="M14 8v7" />
              <path d="M18 5v13" />
              <path d="M22 10v3" />
            </svg>
            <span>Activity</span>
          </button>
        </div>
        <div className="space-y-4 items-center ">
          <div className="border border-b-1"></div>
          <NavLink
            onClick={handleLogout}
            to={"/orgLogin"}
            className="flex space-x-2 items-center text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out-icon lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>LogOut</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

const UserDashboard = () => {
  const [status, setStatus] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, userDetails, setUserDetails } = useAppContext();
  const [selectedUser, setSelectedUser] = useState({});
  const [language, setLanguage] = useState("All");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [blurBg, setBlurBg] = useState(false);

  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar
        status={status}
        setStatus={setStatus}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 w-[calc(100%-280px)]">
        {/* Header */}
        <div className="w-full justify-between shadow-md h-[80px] items-center flex bg-white z-10  pl-6 pr-6">
          {/* Hamburger menu for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34856C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {status == "activity" ? (
            <div className="w-[230px] rounded-lg h-[50px] bg-[#D9E0E6] text-[18px] pt-[10px] pl-[13px] pb-[10px] pr-[13px]">
              <h1 className="text-gray-600">
                Credit available :{" "}
                <span className="text-[#34856C]">
                  {userDetails.credits || 0}
                </span>
              </h1>
            </div>
          ) : null}

          <div
            className={`flex flex-1 items-center space-x-4 md:space-x-20 text-center justify-center ${
              status != "home" ? "invisible md:invisible" : null
            }`}
          >
            <select
              onClick={() => setBlurBg(true)}
              className="rounded-lg focus:outline-none bg-gray-50 text-sm p-2"
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
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#34856C] focus:border-[#34856C] sm:text-sm"
                  dateFormat="dd/MM/yyyy"
                  id="startDate"
                />
              </div>
              <span className="text-gray-700">to</span>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#34856C] focus:border-[#34856C] sm:text-sm"
                  dateFormat="dd/MM/yyyy"
                  id="endDate"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-[16px] items-center">
            <span
              className="font-bold hidden md:block"
              style={{ fontFamily: "Poppins" }}
            >
              Welcome <span></span>
              {userDetails.userName?.split(" ")[0]}
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-icon lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
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
