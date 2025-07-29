import React from "react";
import Wave from "../../assets/Wave.png";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-[#F8FAFA] p-4 sm:p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between sticky top-0 z-0 min-h-[88svh] lg:h-[88svh] space-y-8 lg:space-y-0 lg:space-x-6">
      <div className="space-y-6 sm:space-y-8 text-center lg:text-left max-w-2xl lg:max-w-none">
        <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-[48px] flex flex-col gap-1 sm:gap-2 font-bold">
          <span className="text-[#34856C]">Empower Voice...</span>
          <span>Transformative Technology...</span>
          <span className="text-[#FF6B5B]">Unleash Potential</span>
        </h1>
        <p className="font-inter text-[#5F6C7B] text-sm sm:text-base lg:text-[18px] leading-relaxed">
          Shaping the future of communication, leadership, and emotional
          intelligence with advanced AI solutions
        </p>
        <div className="font-poppins flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-[32px]">
          <NavLink
            to={"/orgLogin"}
            className="px-6 sm:px-8 lg:pl-[53px] lg:pr-[53px] py-3 lg:pt-[10px] lg:pb-[10px] text-sm sm:text-base lg:text-[16px] hover:shadow-2xl cursor-pointer rounded-lg bg-[#FF6B5B] w-full sm:w-auto lg:w-[199px] font-semibold text-white text-center transition-all duration-200 hover:bg-[#e55a4a]"
          >
            Get Started
          </NavLink>
          <button className="border w-full sm:w-auto lg:w-[199px] hover:bg-[#34856C] cursor-pointer hover:text-white rounded-lg font-semibold px-6 sm:px-8 lg:pl-[53px] lg:pr-[53px] py-3 lg:pt-[10px] lg:pb-[10px] text-sm sm:text-base lg:text-[16px] text-[#34856C] border-[#34856C] transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <img
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[577px] lg:h-[577px] object-contain"
          src={Wave}
          alt="Wave illustration"
        />
      </div>
    </div>
  );
};
``;
export default Hero;
