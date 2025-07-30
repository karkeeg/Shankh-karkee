import React from "react";

const ContactForm = () => {
  return (
    <div className="flex text-white flex-col justify-center space-y-8 sm:space-y-12 lg:space-y-16 items-center w-full h-full">
      <div className="justify-center text-center px-4">
        <h1
          style={{ fontFamily: "Poppins" }}
          className="text-2xl sm:text-3xl lg:text-[48px] font-semibold text-[#FAFBFD]"
        >
          Contact Us
        </h1>
        <p
          style={{ fontFamily: "Inter" }}
          className="text-base sm:text-lg lg:text-[24px] w-full max-w-[701px] text-white mt-2 sm:mt-4"
        >
          {" "}
          For a demo, partnership inquiry, or to learn how we can help you
          empower voices and unleash potential.{" "}
        </p>
      </div>
      <div className="w-full max-w-[650px] space-y-4 sm:space-y-6 px-4">
        <div className="flex flex-col sm:flex-row text-white justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="First Name"
            ></input>
            <div className="border-b-1 focus-visible:none"></div>
          </div>
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="Last Name"
            ></input>
            <div className="border-b-1"></div>
          </div>
        </div>
        <div
          style={{ fontFamily: "Inter" }}
          className="flex flex-col sm:flex-row text-white justify-between space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="Organization Name"
            ></input>
            <div className="border-b-1 "></div>
          </div>
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="Your Designation"
            ></input>
            <div className="border-b-1 "></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row text-white justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="Email"
            ></input>
            <div className="border-b-1"></div>
          </div>
          <div className="space-y-1 w-full sm:w-[300px]">
            <input
              className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
              placeholder="Subject"
            ></input>
            <div className="border-b-1"></div>
          </div>
        </div>
        <div className="space-y-1 h-[60px] sm:h-[86px] text-white">
          <input
            className="focus:outline-none placeholder-gray-400 w-full bg-transparent"
            placeholder="Message"
          ></input>
          <div className="border-b-1"></div>
        </div>
        <button
          style={{ fontFamily: "Poppins" }}
          className="pt-[10px] hover:shadow-2xl cursor-pointer text-[16px] pb-[10px] pl-[53px] pr-[53px] rounded-lg bg-[#FF6B5B] w-full font-semibold text-white"
        >
          Get in Touch
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
