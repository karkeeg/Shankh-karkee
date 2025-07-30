import React from "react";
import dp from "../../assets/dp.jpg";

const Testimonials = () => {
  return (
    <div
      id="Testimonials"
      className="p-4 sm:p-6 lg:p-8 xl:p-[60px] bg-[#F8FAFA] flex flex-col justify-center items-center h-screen content-center text-center sticky top-0 z-0 space-y-4 sm:space-y-6 lg:space-y-8 mt-28 lg:mt-32 xl:mt-0 2xl:mt-48"
    >
      <h1
        style={{ fontFamily: "Poppins" }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[54px] text-[#FF6B5B] font-semibold px-2 sm:px-4"
      >
        What our Users say
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 content-center w-full max-w-7xl px-2 sm:px-4">
        <div className="space-y-4 w-full">
          <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[250px] xl:h-[316px] hover:border-t-[#FF6B5B] hover:border-t-4 p-3 sm:p-4 lg:p-6 rounded-lg flex flex-col justify-between bg-[#FAFBFD] shadow-md">
            <p
              style={{ fontFamily: "Inter" }}
              className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B] justify-between text-start leading-relaxed"
            >
              Shankh helped me overcome my fear of public speaking. The AI
              feedback is incredibly intuitive and supportive.
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[49px] lg:h-[49px] rounded-full object-cover flex-shrink-0"
                src={dp}
                alt="Amit"
              />
              <div className="grid text-start space-y-0">
                <span
                  style={{ fontFamily: "Poppins" }}
                  className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold"
                >
                  Amit
                </span>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B]"
                >
                  University Student
                </span>
              </div>
            </div>
          </div>
          <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] xl:h-[196px] hover:border-t-[#FF6B5B] hover:border-t-4 p-3 sm:p-4 lg:p-6 rounded-lg flex flex-col justify-between bg-[#FAFBFD] shadow-md">
            <p
              style={{ fontFamily: "Inter" }}
              className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B] justify-between text-start leading-relaxed"
            >
              As a teacher, I've seen my students gain confidence in their
              speech and communication skills. Highly recommended!
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[49px] lg:h-[49px] rounded-full object-cover flex-shrink-0"
                src={dp}
                alt="Priya"
              />
              <div className="grid text-start space-y-0">
                <span
                  style={{ fontFamily: "Poppins" }}
                  className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold"
                >
                  Priya
                </span>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B]"
                >
                  High School Educator
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 w-full">
          <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] xl:h-[189px] hover:border-t-[#FF6B5B] hover:border-t-4 p-3 sm:p-4 lg:p-6 rounded-lg flex flex-col justify-between bg-[#FAFBFD] shadow-md">
            <p
              style={{ fontFamily: "Inter" }}
              className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B] justify-between text-start leading-relaxed"
            >
              The AI-driven coaching felt like a personal mentor guiding me
              through my weaknesses. A game-changer!
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[49px] lg:h-[49px] rounded-full object-cover flex-shrink-0"
                src={dp}
                alt="Alex M."
              />
              <div className="grid text-start space-y-0">
                <span
                  style={{ fontFamily: "Poppins" }}
                  className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold"
                >
                  Alex M.
                </span>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B]"
                >
                  Freelance Developer
                </span>
              </div>
            </div>
          </div>
          <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[250px] xl:h-[316px] hover:border-t-[#FF6B5B] hover:border-t-4 p-3 sm:p-4 lg:p-6 rounded-lg flex flex-col justify-between bg-[#FAFBFD] shadow-md">
            <p
              style={{ fontFamily: "Inter" }}
              className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B] justify-between text-start leading-relaxed"
            >
              The AI-driven coaching felt like a personal mentor guiding me
              through my weaknesses. A game-changer!
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[49px] lg:h-[49px] rounded-full object-cover flex-shrink-0"
                src={dp}
                alt="Rahul"
              />
              <div className="grid text-start space-y-0">
                <span
                  style={{ fontFamily: "Poppins" }}
                  className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold"
                >
                  Rahul
                </span>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B]"
                >
                  Startup Founder
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:col-span-2 lg:col-span-1">
          <div className="min-h-[220px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[320px] xl:h-[521px] hover:border-t-[#FF6B5B] hover:border-t-4 p-3 sm:p-4 lg:p-6 rounded-lg flex flex-col justify-between bg-[#FAFBFD] shadow-md">
            <p
              style={{ fontFamily: "Inter" }}
              className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B] justify-between text-start leading-relaxed"
            >
              Our employees have significantly improved their presentation and
              leadership communication skills since integrating Shankh into our
              training program.
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[49px] lg:h-[49px] rounded-full object-cover flex-shrink-0"
                src={dp}
                alt="HR Manager"
              />
              <div className="grid text-start space-y-0">
                <span
                  style={{ fontFamily: "Poppins" }}
                  className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold"
                >
                  HR Manager
                </span>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-xs sm:text-sm md:text-base lg:text-[16px] text-[#5F6C7B]"
                >
                  Tech Firm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
