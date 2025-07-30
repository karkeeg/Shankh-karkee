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

      <div className="h-[20px] sticky -top-8 z-10 rounded-t-2xl justify-center flex flex-col items-center p-2 bg-[#34856C]">
        <div className="w-[50px] border-white text-white h-[0.5px] border-2"></div>
      </div>

      <div id="Features" className="bg-[#34856C] h-full text-[#F8FAFA]">
        <div
          className="bg-[#34856C] sticky w-full z-20 top-16 sm:top-12 md:top-16 lg:top-20 p-2 sm:p-2 lg:p-2"
          style={{ fontFamily: "Poppins" }}
        >
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[64px] text-center px-2">
            Why Choose Shankh?
          </h1>
          <div className="border h-[1px] z-0 border-white"></div>
        </div>

        <div className="h-[400svh] relative">
          {/* Feature 1 */}
          <div className="flex min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] items-start z-10 p-4 sm:p-6 lg:p-8 sticky top-26 sm:top-12 md:top-26 lg:top-26 xl:top-26 bg-[#34856C] justify-between">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold flex-shrink-0 mr-2 sm:mr-4">
              1.
            </span>
            <div className="space-y-2 sm:space-y-4 lg:space-y-4 w-full sm:w-[85%] lg:w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6"
              >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[48px] w-full font-semibold leading-tight">
                  AI-Driven Speech Analysis
                </h1>
                <img
                  src={point1}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 flex-shrink-0"
                  alt="AI Speech Analysis"
                />
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="z-10 space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px] w-full leading-relaxed">
                  Gain instant, accurate feedback on every aspect of your verbal
                  communication. Our advanced AI technology analyzes
                  pronunciation, articulation, tone, pace, fluency, and speech
                  clarity—providing actionable insights that transform how you
                  speak and present yourself
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Real-time Feedback</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold">Comprehensive Analysis</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Personalized Insights</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border z-20 border-white"></div>

          {/* Feature 2 */}
          <div className="flex min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 z-20 sticky top-28 sm:top-12 md:top-28 lg:top-34 xl:top-36 justify-between bg-[#34856C]">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold flex-shrink-0 mr-2 sm:mr-4">
              2.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-full sm:w-[85%] lg:w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6"
              >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-tight w-full font-semibold">
                  Emotionally Intelligent Feedback
                </h1>
                <img
                  src={point2}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 flex-shrink-0"
                  alt="Emotional Intelligence"
                />
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="z-10 space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px] w-full leading-relaxed">
                  Experience feedback that builds confidence rather than
                  criticism. Our AI delivers encouraging, constructive insights
                  that help refine both your speech delivery and
                  self-confidence, creating a supportive environment for
                  continuous growth.
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Supportive Guidance</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold">Confidence Building</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Adaptive Coaching</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border z-30 border-white"></div>

          {/* Feature 3 */}
          <div className="flex min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 justify-between bg-[#34856C] sticky top-28 sm:top-12 md:top-28 lg:top-34 xl:top-36 z-30">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold flex-shrink-0 mr-2 sm:mr-4">
              3.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-full sm:w-[85%] lg:w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6"
              >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[48px] leading-tight w-full font-semibold">
                  Leadership & Communication Workshops
                </h1>
                <img
                  src={point3}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 flex-shrink-0"
                  alt="Leadership Workshops"
                />
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px] w-full leading-relaxed">
                  Elevate your professional presence through specialized
                  training modules. Develop executive presence, master
                  persuasion techniques, and craft impactful communication
                  strategies that position you as a leader in any environment.
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Executive Presence</span>
                  </div>
                  <div className="border-1 border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold">Persuasion Techniques</span>
                  </div>
                  <div className="border-1 border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Strategic Communication</span>
                  </div>
                  <div className="border-1 border-[#F8FAFA]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border z-40 border-white"></div>

          {/* Feature 4 */}
          <div className="flex min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] items-start pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 justify-between bg-[#34856C] sticky top-28 sm:top-12 md:top-30 lg:top-32 xl:top-36 z-40">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold flex-shrink-0 mr-2 sm:mr-4">
              4.
            </span>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 w-full sm:w-[85%] lg:w-[80%]">
              <div
                style={{ fontFamily: "Poppins" }}
                className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6"
              >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[48px] w-full font-semibold">
                  Multi-Language Support
                </h1>
                <img
                  src={point4}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 flex-shrink-0"
                  alt="Multi-Language Support"
                />
              </div>
              <div
                style={{ fontFamily: "Inter" }}
                className="space-y-3 sm:space-y-4 lg:space-y-5 relative"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px] w-full leading-relaxed">
                  Break through language barriers with comprehensive
                  multilingual coaching. Our platform helps you improve speech
                  clarity and communication across multiple languages, with
                  training tailored specifically to your region and individual
                  needs.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>01</span>
                    <span className="font-bold">Language Inclusivity</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>02</span>
                    <span className="font-bold">Global Communication</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
                  <div className="space-x-2 sm:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[24px]">
                    <span>03</span>
                    <span className="font-bold">Regional Customization</span>
                  </div>
                  <div className="border-1 content-extralight border-[#F8FAFA]"></div>
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
