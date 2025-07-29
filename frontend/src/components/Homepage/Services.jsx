import React from "react";
import prop1 from "../../assets/prop1.svg";
import prop2 from "../../assets/prop2.svg";
import prop3 from "../../assets/prop3.svg";
import prop4 from "../../assets/prop4.svg";
import prop5 from "../../assets/prop5.svg";
import prop6 from "../../assets/prop6.png";

const Services = () => {
  return (
    <div
      id="Services"
      className="bg-[#F8FAFA] h-full text-center z-60 content-center"
    >
      <div className="p-4 sm:p-6 lg:p-[32px] space-y-16 sm:space-y-24 lg:space-y-32 flex flex-col h-screen content-center">
        <div className="space-y-4 sm:space-y-6 lg:space-y-7">
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-semibold">
            How it Works?
          </h1>
          <span className="font-inter text-base sm:text-lg md:text-xl lg:text-[24px]">
            Our simple three-step process to transforming your communication
            skills
          </span>
        </div>
        <div className="space-y-8 sm:space-y-12 lg:space-y-16 flex flex-col text-center content-center">
          <div className="h-[20px] sm:h-[25px] lg:h-[29px] rounded-r-full rounded-l-full flex justify-between items-center bg-[#34856C] px-2 sm:px-4 lg:px-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px] rounded-full bg-[#FF6B5B] text-lg sm:text-xl lg:text-[40px] text-white font-bold flex items-center justify-center">
              1
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px] rounded-full bg-[#FF6B5B] text-lg sm:text-xl lg:text-[40px] text-white font-bold flex items-center justify-center">
              2
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px] rounded-full bg-[#FF6B5B] text-lg sm:text-xl lg:text-[40px] text-white font-bold flex items-center justify-center">
              3
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="w-full lg:w-[384px] hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-[18px] bg-white rounded-md">
              <h1 className="font-poppins text-xl sm:text-2xl lg:text-[32px] w-full lg:w-[320px] text-[#333333] font-bold">
                Record & Speak
              </h1>
              <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px] text-[#5F6C7B]">
                Choose a scenario and practice your speech with AI-driven real-time feedback
              </p>
            </div>
            <div className="w-full lg:w-[384px] hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-[18px] bg-white rounded-md">
              <h1 className="font-poppins text-xl sm:text-2xl lg:text-[32px] w-full lg:w-[320px] text-[#333333] font-bold">
                Analyze & Improve
              </h1>
              <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px] text-[#5F6C7B]">
                Receive AI-powered insights on pronunciation, articulation,
                pacing, and emotional impact.
              </p>
            </div>
            <div className="w-full lg:w-[384px] hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-[18px] bg-white rounded-md">
              <h1 className="font-poppins text-xl sm:text-2xl lg:text-[32px] w-full lg:w-[320px] text-[#333333] font-bold">
                Master & Lead
              </h1>
              <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px] text-[#5F6C7B]">
                Apply your skills in real-world settings, track progress, and
                develop as a confident communicator and leader.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-8 sm:space-y-10 lg:space-y-12 flex flex-col justify-center h-screen items-center p-4 sm:p-6 lg:p-[75px]">
        <div className="space-y-4">
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-semibold">
            Who Can Benefit?
          </h1>
          <span className="font-inter text-base sm:text-lg md:text-xl lg:text-[24px] w-full max-w-4xl text-[#5F6C7B]">
            Shankh is designed to help diverse users achieve their leadership,
            communication and emotional wellbeing goals
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-x-[70px] lg:gap-y-[8px]">
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop1} alt="Students & Educators" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Students & Educators
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Improve classroom participation, debate skills, and public
              speaking confidence
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop2} alt="Professionals & Corporates" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Professionals & Corporates
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Get real-time feedback on pronunciation, tone, pace, and fluency
              to improve your communication skills effectively.
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop3} alt="Public Speakers & Entrepreneurs" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Public Speakers & Entrepreneurs
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Deliver compelling speeches and master the art of persuasion
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop4} alt="Actors & Voice Artists" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Actors & Voice Artists
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Train articulation, tone modulation, and emotional expression for
              a professional edge
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop5} alt="Individuals with Speech Goals" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Individuals with Speech & Communication Goals
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Build confidence in speech clarity, articulation, and fluency
              improvement.
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-[24px] hover:border-t-[#34856C] hover:border-t-4 w-full lg:w-[384px] bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 lg:space-y-[16px] text-center flex flex-col items-center content-center">
            <img className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px]" src={prop6} alt="Speech Coaches & Therapists" />
            <h1 className="font-poppins text-lg sm:text-xl lg:text-[24px] w-full lg:w-[320px] font-bold">
              Speech Coaches & Therapists
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] w-full lg:w-[320px]">
              Integrate AI-driven insights into speech development programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
