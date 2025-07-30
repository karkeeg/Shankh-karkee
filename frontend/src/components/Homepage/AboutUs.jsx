import React from "react";
import Team from "./Team";
import { NavLink } from "react-router-dom";

const AboutUs = () => {
  return (
    <div
      id="AboutUs"
      className="bg-[#F8FAFA] flex flex-col justify-center items-center space-y-6 sm:space-y-8 lg:space-y-12 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 "
    >
      <h1
        style={{ fontFamily: "Poppins" }}
        className="text-[#FF6B5B] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] text-center"
      >
        Meet Our Team
      </h1>
      <p
        style={{ fontFamily: "Inter" }}
        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-[#5F6C7B] text-center max-w-4xl mx-auto leading-relaxed px-2"
      >
        At Shankh, we are a passionate team of AI researchers, communication
        experts, and leadership coaches dedicated to transforming the way people
        communicate and lead
      </p>
      <div
        style={{ fontFamily: "Poppins" }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8"
      >
        <NavLink
          to={"/orgLogin"}
          className="px-6 sm:px-8 lg:px-12 py-3 lg:py-4 hover:shadow-lg text-sm sm:text-base lg:text-[16px] rounded-lg bg-[#FF6B5B] w-full sm:w-auto min-w-[160px] sm:min-w-[199px] font-semibold text-white text-center transition-all duration-200 hover:bg-[#e55a4a]"
        >
          Get Started
        </NavLink>
        <button className="border hover:bg-[#34856C] hover:text-white w-full sm:w-auto min-w-[160px] sm:min-w-[199px] rounded-lg font-semibold px-6 sm:px-8 lg:px-12 py-3 lg:py-4 text-sm sm:text-base lg:text-[16px] text-[#34856C] border-[#34856C] transition-all duration-200">
          Learn More
        </button>
      </div>
      <Team />
      <p
        style={{ fontFamily: "Inter" }}
        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-[#5F6C7B] text-center max-w-4xl mx-auto leading-relaxed px-2"
      >
        Our team brings together deep expertise in linguistics, psychology, and
        artificial intelligence to create a platform that truly empowers
        individuals and organizations.
      </p>
    </div>
  );
};

export default AboutUs;
