import React from "react";
import prop1 from "../../assets/prop1.svg";
import prop2 from "../../assets/prop2.svg";
import prop3 from "../../assets/prop3.svg";
import prop4 from "../../assets/prop4.svg";
import prop5 from "../../assets/prop5.svg";
import prop6 from "../../assets/prop6.png";

const Services = () => {
  return (
    <div id="Services" className="bg-[#F8FAFA] min-h-screen text-center">
      {/* How it Works Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 space-y-8 sm:space-y-12 lg:space-y-20 flex flex-col justify-center min-h-screen">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] font-semibold px-2 sm:px-4">
            How it Works?
          </h1>
          <span className="font-inter text-md sm:text-sm md:text-lg lg:text-xl xl:text-[24px] px-2 sm:px-4 max-w-4xl mx-auto leading-relaxed">
            Our simple three-step process to transforming your communication
            skills
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-center">
          <div className="my-2 sm:my-2 lg:my-2 xl:my-4 w-full flex justify-center">
            <div className="h-4 sm:h-4 lg:h-6 rounded-full flex justify-between items-center bg-[#34856C]  sm:px-4 lg:px-0 max-w-md mx-auto w-full">
              <div className="w-8 h-8 sm:w-10 sm:h-12 lg:w-16 lg:h-16 xl:w-[70px] xl:h-[70px] rounded-full bg-[#FF6B5B] text-sm sm:text-lg lg:text-2xl xl:text-[40px] text-white font-bold flex items-center justify-center">
                1
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-[70px] xl:h-[70px] rounded-full bg-[#FF6B5B] text-sm sm:text-lg lg:text-2xl xl:text-[40px] text-white font-bold flex items-center justify-center">
                2
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-[70px] xl:h-[70px] rounded-full bg-[#FF6B5B] text-sm sm:text-lg lg:text-2xl xl:text-[40px] text-white font-bold flex items-center justify-center">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 lg:px-0 mt-2 lg:mt-6 xl:mt-8">
          <div className="w-full lg:w-1/3 max-w-sm lg:max-w-none hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-6 bg-white rounded-lg mx-auto lg:mx-0">
            <h1 className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] text-[#333333] font-bold">
              Record & Speak
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] text-[#5F6C7B] leading-relaxed">
              Choose a scenario and practice your speech with AI-driven real-time feedback
            </p>
          </div>
          <div className="w-full lg:w-1/3 max-w-sm lg:max-w-none hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-6 bg-white rounded-lg mx-auto lg:mx-0">
            <h1 className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] text-[#333333] font-bold">
              Analyze & Improve
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] text-[#5F6C7B] leading-relaxed">
              Receive AI-powered insights on pronunciation, articulation,
              pacing, and emotional impact.
            </p>
          </div>
          <div className="w-full lg:w-1/3 max-w-sm lg:max-w-none hover:shadow-lg space-y-4 shadow-sm p-4 sm:p-6 lg:p-6 bg-white rounded-lg mx-auto lg:mx-0">
            <h1 className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] text-[#333333] font-bold">
              Master & Lead
            </h1>
            <p className="font-inter text-sm sm:text-base lg:text-[16px] text-[#5F6C7B] leading-relaxed">
              Apply your skills in real-world settings, track progress, and
              develop as a confident communicator and leader.
            </p>
          </div>
        </div>
      </div>

      {/* Who Can Benefit Section */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16 flex flex-col justify-center min-h-screen items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-4 sm:space-y-6 text-center max-w-6xl w-full">
          <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] font-semibold px-2 sm:px-4">
            Who Can Benefit?
          </h1>
          <span className="font-inter text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-[#5F6C7B] px-2 sm:px-4 max-w-4xl mx-auto leading-relaxed">
            Shankh is designed to help diverse users achieve their leadership,
            communication and emotional wellbeing goals
          </span>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl px-2 sm:px-4 lg:px-0">
          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop1} alt="Students & Educators" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Students & Educators
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Improve classroom participation, debate skills, and public
              speaking confidence
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop2} alt="Professionals & Corporates" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Professionals & Corporates
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Get real-time feedback on pronunciation, tone, pace, and fluency
              to improve your communication skills effectively.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop3} alt="Public Speakers & Entrepreneurs" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Public Speakers & Entrepreneurs
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Deliver compelling speeches and master the art of persuasion
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop4} alt="Actors & Voice Artists" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Actors & Voice Artists
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Train articulation, tone modulation, and emotional expression for
              a professional edge
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop5} alt="Individuals with Speech Goals" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Individuals with Speech & Communication Goals
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Build confidence in speech clarity, articulation, and fluency
              improvement.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-6 hover:border-t-[#34856C] hover:border-t-4 bg-white shadow-md rounded-lg space-y-3 sm:space-y-4 text-center flex flex-col items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-[56px] xl:h-[56px]" src={prop6} alt="Speech Coaches & Therapists" />
            <h1 className="font-poppins text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px] font-bold">
              Speech Coaches & Therapists
            </h1>
            <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed">
              Integrate AI-driven insights into speech development programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
