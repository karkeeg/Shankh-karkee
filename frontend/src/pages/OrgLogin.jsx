import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAppContext } from "../context/appContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const OrgLogin = () => {
  const { setIsAuthenticated, orgDetails, setOrgDetails, setUserDetails } =
    useAppContext();
  const [type, setType] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url =
        type == "admin"
          ? `${import.meta.env.VITE_API_BASE_URL}/api/adminAuth`
          : `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", res.data ? res.data.token : "");

      setIsAuthenticated(true);

      if (!res.data) {
        return;
      }

      if (type == "admin") {
        setOrgDetails(res.data.details);
        toast.success(res.message);
        navigate("/orgDashboard");
      } else {
        if (res.data.user.firstLogin) {
          setUserDetails(res.data.user);
          navigate("/onboarding");
          return;
        }
        setUserDetails(res.data.user);
        toast.success(res.message);
        navigate("/userDashboard");
      }

      // alert(res.message);
    } catch (error) {
      console.log(error.message);
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

  // toast("hi")

  return (
    <form
      onSubmit={handleLogin}
      className="bg-[#F8FAFA] flex flex-col z-0 items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative rounded-xl bg-white flex flex-col justify-center space-y-[20px] w-full max-w-[700px] p-6 sm:p-[30px] sm:pr-[76px] sm:pl-[76px] sm:pt-[30px] sm:pb-[30px] h-auto sm:h-[450px]"
      >
        <div className="hidden md:block absolute z-0 top-0 bottom-0 right-[-50px] w-[250px] rounded-l-full bg-[#34856C]" />

        <span className="text-[#34856C]">Shankh</span>
        <span
          style={{ fontFamily: "Poppins" }}
          className="text-[20px] font-semibold text-[#34856C]"
        >
          Welcome Back !
        </span>

        <div className="grid space-y-1">
          <span style={{ fontFamily: "Inter" }} className="text-[14px]">
            Email
          </span>
          <input
            id="email"
            onChange={handleChange}
            value={data.email}
            className="border-[1px] focus:outline-none h-[46px] p-[11px_15px] w-full sm:w-[300px]"
            placeholder="Enter your email address"
          />
        </div>

        <div className="grid space-y-1">
          <span style={{ fontFamily: "Inter" }} className="text-[14px]">
            Password
          </span>
          <div className="relative w-full sm:w-[300px]">
            <input
              id="password"
              onChange={handleChange}
              value={data.password}
              className="border-[1px] focus:outline-none h-[46px] p-[11px_15px] w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="flex space-x-10">
          <div className="flex items-center space-x-2">
            <input
              onClick={() => setType("admin")}
              checked={type === "admin"}
              type="radio"
            />
            <span>Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              onClick={() => setType("user")}
              checked={type === "user"}
              type="radio"
            />
            <span>User</span>
          </div>
        </div>

        <div className="inline-grid space-y-1">
          <span
            style={{ fontFamily: "Poppins" }}
            className="text-xs text-red-600"
          >
            {error}
          </span>
          <button className="w-full sm:w-[300px] cursor-pointer text-center rounded-lg bg-[#FF6B5B] text-white font-semibold text-[16px] p-[10px_53px]">
            Login
          </button>
        </div>

        <span style={{ fontFamily: "Inter" }} className="text-[14px]">
          Not a member?{" "}
          <NavLink to={"/orgSignUp"} className="text-[#34856C]">
            Register Now
          </NavLink>
        </span>
      </motion.div>
    </form>
  );
};

export default OrgLogin;
