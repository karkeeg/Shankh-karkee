import React from "react";
import Hero from "./Hero";
import point1 from "../../assets/point1.png";
import point2 from "../../assets/point2.png";
import point3 from "../../assets/point3.png";
import point4 from "../../assets/point4.svg";

const Features = () => {
  return (
    <div className="w-full">
      <Hero className="top-0 z-0 sticky" />
      <div className=" h-[20px] sticky -top-8 z-10 rounded-t-2xl justify-center flex flex-col  items-center p-2 bg-[#34856C] ">
        <div className=" w-[50px] border-white text-white h-[0.5px]  border-2 "></div>
      </div>
      <div id="Features" className="bg-[#34856C] h-full text-[#F8FAFA] ">
        <div
          className="bg-[#34856C] sticky w-full z-20 top-20 p-2 sm:p-2 lg:p-2"
          style={{ fontFamily: "Poppins" }}
        >
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] text-center">
            Why Choose Shankh?
          </h1>
          <div className="border h-[1px] z-0 border-white"></div>
        </div>
        <div className="h-[400svh] relative ">
          <div className="flex min-h-[60vh] sm:min-h-[80vh] lg:min-h-[90vh] items-start z-10 p-4 sm:p-6 lg:p-8 sticky top-16 sm:top-20 lg:top-34 bg-[#34856C] justify-between">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold">
              1.
            </span>
            <div className="space-y-2 sm:space-y-4 lg:space-y-4 w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-4 sm:gap-6"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] w-full font-semibold">
                  AI-Driven Speech Analysis
                </h1>
                <img
                  src={point1}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex-shrink-0"
                ></img>
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="z-10 space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full">
                  Gain instant, accurate feedback on every aspect of your verbal
                  communication. Our advanced AI technology analyzes
                  pronunciation, articulation, tone, pace, fluency, and speech
                  clarity—providing actionable insights that transform how you
                  speak and present yourself
                </p>

                <div className="space-y-2">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Real-time Feedback</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold ">Comprehensive Analysis</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Personalized Insights</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="border z-20 border-white"></div>
          <div className="flex min-h-[60vh] sm:min-h-[80vh] lg:min-h-[90vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 z-20 sticky top-16 sm:top-20 lg:top-42 justify-between bg-[#34856C] ">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold">
              2.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-4 sm:gap-6"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] leading-tight w-full font-semibold">
                  Emotionally Intelligent Feedback
                </h1>
                <img
                  src={point2}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex-shrink-0"
                ></img>
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="z-10 space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full">
                  Experience feedback that builds confidence rather than
                  criticism. Our AI delivers encouraging, constructive insights
                  that help refine both your speech delivery and
                  self-confidence, creating a supportive environment for
                  continuous growth.
                </p>

                <div className="space-y-2">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Supportive Guidance</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold ">Confidence Building</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Adaptive Coaching</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="border z-30 border-white"></div>
          <div className="flex min-h-[60vh] sm:min-h-[80vh] lg:min-h-[90vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 justify-between bg-[#34856C] sticky top-16 sm:top-20 lg:top-42 z-30">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold">
              3.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-4 sm:gap-6"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] leading-12 w-full font-semibold">
                  Leadership & Communication Workshops
                </h1>
                <img
                  src={point3}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex-shrink-0"
                ></img>
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full">
                  Elevate your professional presence through specialized
                  training modules. Develop executive presence, master
                  persuasion techniques, and craft impactful communication
                  strategies that position you as a leader in any environment.
                </p>

                <div className="space-y-2">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Executive Presence</span>
                  </div>
                  <div className=" border-1  border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold ">Persuasion Techniques</span>
                  </div>
                  <div className=" border-1  border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Strategic Communication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border z-40 border-white"></div>
          <div className="flex min-h-[60vh] sm:min-h-[80vh] lg:min-h-[90vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 justify-between bg-[#34856C] sticky top-16 sm:top-20 lg:top-42 z-40">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold">
              4.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-4 sm:gap-6"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] w-full font-semibold">
                  Multi-Language Support
                </h1>
                <img
                  src={point4}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex-shrink-0"
                />
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full">
                  Break through language barriers with comprehensive
                  multilingual coaching. Our platform helps you improve speech
                  clarity and communication across multiple languages, with
                  training tailored specifically to your region and individual
                  needs.
                </p>
                <div className="space-y-2">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Language Inclusivity</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold ">Global Communication</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Regional Customization</span>
                  </div>
                  <div className=" border-1 content-extralight border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
