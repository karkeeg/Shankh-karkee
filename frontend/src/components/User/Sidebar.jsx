import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";
import Logo2 from "../../assets/Logo2.png";

const Sidebar = ({ status, setStatus, setSidebarOpen }) => {
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
    <div
      style={{ fontFamily: "Poppins" }}
      className="font-semibold w-[280px] sm:w-[305px] flex justify-between flex-col pr-[22.52px] pb-[20.03px] pl-[22.52px] pt-[20.03px] text-white bg-[#34856C] h-screen"
    >
      <div className="flex space-y-[30px] sm:space-y-[50px] flex-col">
        {/* Header with Logo and Close Button */}
        <div className="flex justify-between items-center">
          <img
            className="w-[120px] sm:w-[141px] h-[32px] sm:h-[38px] text-white"
            src={Logo2}
            alt="Logo"
          ></img>
          {/* Close Button - Visible on mobile, hidden on desktop */}
          <button
            onClick={handleCloseSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 hover:bg-opacity-20 transition-colors"
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
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <button
          onClick={() => handleNavigation("home")}
          className={`flex rounded-lg space-x-2 p-[7.51px] items-center text-sm sm:text-base ${
            status == "home" ? "bg-[white] text-black " : null
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
  );
};

export default Sidebar;
