import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { useAppContext } from "../../context/appContext";
import SpiderChart from "../../SpiderChart";
import axios from "axios";
import { Tooltip } from "@mui/material";

const UserHome = ({ language, startDate, endDate, setStatus }) => {
  const { userDetails, setSelectedTest } = useAppContext();
  const [temp, setTemp] = useState([]);
  const [data, setData] = useState([]);

  const [viewAll, setViewAll] = useState(false);

  const [behaviorAverages, setBehaviorAverages] = useState({});

  const [voiceAverages, setVoiceAverages] = useState({
    Fluency: 0,
    Clarity: 0,
    "Tone Modulation": 0,
    "Filler Words": 0,
  });

  // Function to deeply sanitize data
  const sanitizeData = (data) => {
    if (!data) return data;
    
    // If data is an array, process each item
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    // If data is an object, process each property
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      
      // Handle Buffer objects
      if (data.buffer && typeof data.buffer === 'object') {
        try {
          // Convert buffer to string if it's a valid buffer
          const buffer = data.buffer;
          if (buffer.byteLength) {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(buffer));
          }
        } catch (e) {
          console.error('Error processing buffer:', e);
          return '[Buffer]';
        }
      }
      
      // Process all other object properties
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Skip functions and undefined values
        if (typeof value === 'function' || value === undefined) return;
        
        // Recursively sanitize nested objects/arrays
        sanitized[key] = sanitizeData(value);
      });
      
      return sanitized;
    }
    
    // Return primitives as-is
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/getAllTests`
        );
        
        // Sanitize the data before setting state
        const filteredData = res.data.data
          .filter(item => item.userId !== userDetails?._id)
          .map(item => ({
            ...item,
            // Ensure overallScore is a number
            overallScore: item.overallScore 
              ? Number(item.overallScore) || 0 
              : 0
          }));
          
        const sanitizedData = sanitizeData(filteredData);
        
        setTemp(sanitizedData);
        setData(sanitizedData);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setTemp([]);
        setData([]);
      }
    };

    fetchData();
  }, [userDetails?._id]);

  console.log("data", data);
  useEffect(() => {
    if (language == "All") {
      setData(
        temp.filter(
          (item) =>
            new Date(item.date).setHours(0, 0, 0, 0) >=
              new Date(startDate).setHours(0, 0, 0, 0) &&
            new Date(item.date).setHours(0, 0, 0, 0) <=
              new Date(endDate).setHours(0, 0, 0, 0)
        )
      );
      return;
    }

    setData(
      temp.filter(
        (item) =>
          item.language === language &&
          new Date(item.date) >= new Date(startDate) &&
          new Date(item.date) <= new Date(endDate)
      )
    );

    console.log("data", data);
  }, [language, startDate, endDate]);

  useEffect(() => {
    const newBehaviorAverages = {
      "Emotional Regulation": 0,
      "Confidence and Presence": 0,
      "Pacing and Pauses": 0,
      Engagement: 0,
    };

    const newVoiceAverages = {
      Fluency: 0,
      Clarity: 0,
      "Tone Modulation": 0,
      "Filler Words": 0,
    };

    data.forEach((test) => {
      // Handle voice insights - check both old and new structure
      if (test.voiceInsights) {
        // New structure with direct fields
        if (test.fluency) {
          newVoiceAverages["Fluency"] += test.fluency.fluency_score || 0;
        } else {
          // Fallback to old structure
          newVoiceAverages["Fluency"] += test.voiceInsights.fluency || 0;
        }

        if (test.vcs) {
          // Try to get clarity from vcs object
          const clarityValue =
            test.vcs["Voice Clarity Score"] ||
            test.vcs["Voice Clarity Sore"] ||
            (typeof test.vcs === "object"
              ? Object.values(test.vcs).find((val) => typeof val === "number")
              : null);
          newVoiceAverages["Clarity"] += Number(clarityValue) || 0;
        } else {
          // Fallback to old structure
          newVoiceAverages["Clarity"] += test.voiceInsights.clarity || 0;
        }

        if (test.tone) {
          newVoiceAverages["Tone Modulation"] +=
            test.tone.speech_dynamism_score || 0;
        } else {
          newVoiceAverages["Tone Modulation"] +=
            test.voiceInsights.toneModulation || 0;
        }

        if (test.filler_words) {
          newVoiceAverages["Filler Words"] +=
            test.filler_words.filler_score || 0;
        } else {
          newVoiceAverages["Filler Words"] +=
            test.voiceInsights.fillerWords || 0;
        }
      }

      // Handle behavior insights - check both old and new structure
      if (
        test.behaviorInsights ||
        test.vers ||
        test.voice_confidence ||
        test.vps ||
        test.ves
      ) {
        // New structure with separate fields
        newBehaviorAverages["Emotional Regulation"] +=
          test.vers?.["VERS Score"] ||
          test.behaviorInsights?.emotionalRegulation ||
          0;

        newBehaviorAverages["Confidence and Presence"] +=
          test.voice_confidence?.["voice_confidence_score"] ||
          test.behaviorInsights?.confidenceAndPresence ||
          0;

        newBehaviorAverages["Pacing and Pauses"] +=
          test.vps?.["VPS"] || test.behaviorInsights?.pacingAndPauses || 0;

        newBehaviorAverages["Engagement"] +=
          test.ves?.["ves"] || test.behaviorInsights?.engagement || 0;
      }
    });

    // Calculate averages
    Object.keys(newVoiceAverages).forEach((key) => {
      newVoiceAverages[key] =
        data.length > 0 ? Math.floor(newVoiceAverages[key] / data.length) : 0;
    });

    Object.keys(newBehaviorAverages).forEach((key) => {
      newBehaviorAverages[key] =
        data.length > 0
          ? Math.floor(newBehaviorAverages[key] / data.length)
          : 0;
    });

    setBehaviorAverages(newBehaviorAverages);
    setVoiceAverages(newVoiceAverages);
  }, [data]);

  // Calculate overall averages
  const behaviourAverage =
    data.length > 0
      ? data.reduce((sum, test) => {
          // Try new structure first, fall back to old structure
          const emotionalRegulation =
            test.vers?.["VERS Score"] ||
            test.behaviorInsights?.emotionalRegulation ||
            0;
          const confidenceAndPresence =
            test.voice_confidence?.["voice_confidence_score"] ||
            test.behaviorInsights?.confidenceAndPresence ||
            0;
          const pacingAndPauses =
            test.vps?.["VPS"] || test.behaviorInsights?.pacingAndPauses || 0;
          const engagement =
            test.ves?.["ves"] || test.behaviorInsights?.engagement || 0;

          const avg =
            (emotionalRegulation +
              confidenceAndPresence +
              pacingAndPauses +
              engagement) /
            4;
          return sum + avg;
        }, 0) / data.length
      : 0;

  const vocalAverage =
    data.length > 0
      ? data.reduce((sum, test) => {
          // Try new structure first, fall back to old structure
          const fluency =
            test.fluency?.fluency_score || test.voiceInsights?.fluency || 0;

          let clarity = 0;
          if (test.vcs) {
            clarity =
              test.vcs["Voice Clarity Score"] ||
              test.vcs["Voice Clarity Sore"] ||
              (typeof test.vcs === "object"
                ? Object.values(test.vcs).find((val) => typeof val === "number")
                : 0);
          } else {
            clarity = test.voiceInsights?.clarity || 0;
          }

          const toneModulation =
            test.tone?.speech_dynamism_score ||
            test.voiceInsights?.toneModulation ||
            0;
          const fillerWords =
            test.filler_words?.filler_score ||
            test.voiceInsights?.fillerWords ||
            0;

          const avg = (fluency + clarity + toneModulation + fillerWords) / 4;
          return sum + avg;
        }, 0) / data.length
      : 0;

  const handleView = (item) => {
    console.log("Selected test data:", JSON.stringify(item, null, 2));
    console.log("Voice Insights:", item.voiceInsights);
    console.log("Clarity value:", item.voiceInsights?.clarity);
    setSelectedTest(item);
    setStatus("results");
  };

  return (
    <div className="bg-[#E7F0F0] min-h-[calc(100vh-80px)] w-full p-2 md:p-6 space-y-6 overflow-y-auto">
      <div className="bg-white w-full shadow-md p-4 rounded-lg space-y-5">
        <h3 className="font-['Poppins'] text-lg md:text-xl font-semibold">
          Here is summary of user scores
        </h3>
        <div className="grid gap-4 p-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="w-full drop-shadow-lg border-l-4 border-[#34856C] rounded-xl bg-white p-4 md:p-6 h-full min-h-[119px]">
            <Tooltip title="Total number of attempts by the user within the selected time period.">
              <div className="flex">
                <span className="font-semibold text-[#5F6C7B] text-[16px]">
                  Total Attempts
                </span>
                <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                  i
                </span>
              </div>
            </Tooltip>
            <span className="text-[24px] font-semibold">{data.length}</span>
          </div>
          <div className="w-full border-l-4 border-[#34856C] rounded-xl bg-white p-4 md:p-6 drop-shadow-lg h-full min-h-[119px]">
            <Tooltip title="Average of all the scores of the user within the selected time period.">
              <div className="flex">
                <span className="font-semibold text-[#5F6C7B] text-[16px]">
                  Average Total Score
                </span>
                <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                  i
                </span>
              </div>
            </Tooltip>
            <span className="text-[24px] font-semibold">
              {Math.ceil(vocalAverage + behaviourAverage) / 2}%
            </span>
          </div>
          <div className="w-full border-l-4 border-[#34856C] rounded-xl bg-white p-4 md:p-6 drop-shadow-lg h-full min-h-[119px]">
            <Tooltip title="Shows the mean performance score across all vocal analysis parameters including tone, pace, clarity, and speech patterns">
              <div className="flex">
                <span className="font-semibold text-[#5F6C7B] text-[16px]">
                  Vocal Insights Average
                </span>
                <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                  i
                </span>
              </div>
            </Tooltip>
            <span className="text-[24px] font-semibold">
              {Math.ceil(vocalAverage)}%
            </span>
          </div>
          <div className="w-full border-l-4 border-[#34856C] rounded-xl bg-white p-4 md:p-6 drop-shadow-lg h-full min-h-[119px]">
            <Tooltip title="Displays the average rating for behavioral assessment criteria such as confidence, engagement, body language, and presentation skills">
              <div className="flex">
                <span className="font-semibold text-[#5F6C7B] text-[16px]">
                  Behaviour Insights Average
                </span>
                <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                  i
                </span>
              </div>
            </Tooltip>
            <span className="text-[24px] font-semibold">
              {Math.ceil(behaviourAverage)}%
            </span>
          </div>
        </div>
        <Chart testData={data} />
        <div className="bg-white space-y-4 rounded-lg drop-shadow-lg w-full p-4 md:p-6">
          <h1 className="font-['Poppins'] text-lg md:text-xl font-semibold">
            Performance across Key Parameters
          </h1>
          <div className="font-['Inter'] grid grid-cols-1 lg:grid-cols-2 gap-6 text-base md:text-lg">
            <div className="shadow-lg rounded-lg p-4 md:p-6 w-full">
              <h3 className="font-semibold">
                Voice Insights :
                <span className="font-medium">
                  {" "}
                  The Mechanics of Impactful Speech
                </span>
              </h3>
              <SpiderChart testData={voiceAverages} />
            </div>
            <div className="shadow-lg rounded-lg p-4 md:p-6 w-full">
              <h3 className="font-semibold">
                Behavior Insights :
                <span className="font-medium">
                  {" "}
                  The Psychology of your voice
                </span>
              </h3>
              <SpiderChart testData={behaviorAverages} />
            </div>
          </div>
        </div>
        <div className="bg-white space-y-6 rounded-lg drop-shadow-lg w-full p-4 md:p-6">
          <h1 className="font-['Poppins'] text-lg md:text-xl font-semibold">
            Detailed Voice Insights
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="The smoothness and ease of speech, without hesitations or repetitions.">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Fluency
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    voiceAverages["Fluency"] <= 39
                      ? "text-[#FF6B5B]"
                      : voiceAverages["Fluency"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {voiceAverages["Fluency"] <= 39
                    ? "Emerging"
                    : voiceAverages["Fluency"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {voiceAverages["Fluency"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${voiceAverages["Fluency"]}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      voiceAverages["Fluency"] <= 39
                        ? "bg-[#FF6B5B]"
                        : voiceAverages["Fluency"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="Evaluates articulation, pronunciation, and overall intelligibility of spoken words and phrases">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Clarity
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    voiceAverages["Clarity"] <= 39
                      ? "text-[#FF6B5B]"
                      : voiceAverages["Clarity"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {voiceAverages["Clarity"] <= 39
                    ? "Emerging"
                    : voiceAverages["Clarity"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {voiceAverages["Clarity"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${voiceAverages["Clarity"]}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      voiceAverages["Clarity"] <= 39
                        ? "bg-[#FF6B5B]"
                        : voiceAverages["Clarity"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="The ability to vary pitch, volume, and rate to effectively communicate emotions and ideas">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Tone Modulation
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    voiceAverages["Tone Modulation"] <= 39
                      ? "text-[#FF6B5B]"
                      : voiceAverages["Tone Modulation"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {voiceAverages["Tone Modulation"] <= 39
                    ? "Emerging"
                    : voiceAverages["Tone Modulation"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {voiceAverages["Tone Modulation"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${voiceAverages["Tone Modulation"]}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      voiceAverages["Tone Modulation"] <= 39
                        ? "bg-[#FF6B5B]"
                        : voiceAverages["Tone Modulation"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="The use of filler words, such as 'um' or 'uh', which can indicate a lack of confidence or preparation.">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Filler Words
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    voiceAverages["Filler Words"] <= 39
                      ? "text-[#FF6B5B]"
                      : voiceAverages["Filler Words"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {voiceAverages["Filler Words"] <= 39
                    ? "Emerging"
                    : voiceAverages["Filler Words"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {voiceAverages["Filler Words"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${voiceAverages["Filler Words"]}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      voiceAverages["Filler Words"] <= 39
                        ? "bg-[#FF6B5B]"
                        : voiceAverages["Filler Words"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ fontFamily: "Poppins" }}
          className="bg-white brightness-100 space-y-8 rounded-lg drop-shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]"
        >
          <h1 className="text-[20px] font-semibold">
            Detailed Behavior Insights
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="The ability to effectively manage and express emotions in a professional setting.">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Emotional Regulation
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    behaviorAverages["Emotional Regulation"] <= 39
                      ? "text-[#FF6B5B]"
                      : behaviorAverages["Emotional Regulation"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {behaviorAverages["Emotional Regulation"] <= 39
                    ? "Emerging"
                    : behaviorAverages["Emotional Regulation"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {behaviorAverages["Emotional Regulation"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${behaviorAverages["Emotional Regulation"]}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      behaviorAverages["Emotional Regulation"] <= 39
                        ? "bg-[#FF6B5B]"
                        : behaviorAverages["Emotional Regulation"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="Evaluates vocal authority, self-assurance, and commanding presence conveyed through speech patterns">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Confidence & Presence
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    behaviorAverages["Confidence and Presence"] <= 39
                      ? "text-[#FF6B5B]"
                      : behaviorAverages["Confidence and Presence"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {behaviorAverages["Confidence and Presence"] <= 39
                    ? "Emerging"
                    : behaviorAverages["Confidence and Presence"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {behaviorAverages["Confidence and Presence"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${behaviorAverages["Confidence and Presence"]}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      behaviorAverages["Confidence and Presence"] <= 39
                        ? "bg-[#FF6B5B]"
                        : behaviorAverages["Confidence and Presence"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="Analyzes speech rhythm, strategic use of silence, and appropriate timing for emphasis and comprehension">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Pacing And Pauses
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    behaviorAverages["Pacing and Pauses"] <= 39
                      ? "text-[#FF6B5B]"
                      : behaviorAverages["Pacing and Pauses"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {behaviorAverages["Pacing and Pauses"] <= 39
                    ? "Emerging"
                    : behaviorAverages["Pacing and Pauses"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {behaviorAverages["Pacing and Pauses"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${behaviorAverages["Pacing and Pauses"]}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      behaviorAverages["Pacing and Pauses"] <= 39
                        ? "bg-[#FF6B5B]"
                        : behaviorAverages["Pacing and Pauses"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white drop-shadow-lg rounded-lg p-4">
              <div className="flex justify-between">
                <Tooltip title="Assesses ability to capture and maintain audience attention through dynamic and interactive vocal delivery">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#5F6C7B] text-[16px]">
                      Engagement
                    </span>
                    <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                      i
                    </span>
                  </div>
                </Tooltip>
                <span
                  className={`text-[16px] font-semibold ${
                    behaviorAverages["Engagement"] <= 39
                      ? "text-[#FF6B5B]"
                      : behaviorAverages["Engagement"] <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {behaviorAverages["Engagement"] <= 39
                    ? "Emerging"
                    : behaviorAverages["Engagement"] <= 69
                    ? "Proficient"
                    : "Masterful"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {behaviorAverages["Engagement"]}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${behaviorAverages["Engagement"]}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      behaviorAverages["Engagement"] <= 39
                        ? "bg-[#FF6B5B]"
                        : behaviorAverages["Engagement"] <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg drop-shadow-lg w-full p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
            <h1 className="font-['Poppins'] text-lg md:text-xl font-semibold">
              Recent Tests
            </h1>
            <button
              onClick={() => setViewAll((prev) => !prev)}
              className="w-full sm:w-auto border hover:bg-[#34856C] cursor-pointer hover:text-white rounded-lg font-semibold py-2 px-6 text-[#34856C] border-[#34856C]"
            >
              {viewAll ? "View Less" : "View All"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[#E7F0F0] text-gray-700">
                  <th className="p-3 text-left font-medium hidden md:table-cell">
                    Test ID
                  </th>
                  <th className="p-3 text-left font-medium">Language</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Score</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data && data.length > 0 ? (
                  data
                    .filter((_, index) => viewAll || index >= data.length - 5)
                    .map((item, index) => {
                      // Ensure we have a valid key
                      const rowKey = item?._id ? String(item._id) : `row-${index}`;
                      
                      // Get display score
                      const displayScore = (() => {
                        const score = item?.overallScore;
                        if (score === undefined || score === null) return 'N/A';
                        const numScore = Number(score);
                        return !isNaN(numScore) ? Math.ceil(numScore) : 'N/A';
                      })();
                      
                      return (
                        <tr key={rowKey} className="hover:bg-gray-50">
                          <td className="p-3 hidden md:table-cell truncate max-w-[150px] text-xs">
                            {item?._id ? String(item._id) : 'N/A'}
                          </td>
                          <td className="p-3">{item?.language ? String(item.language) : 'N/A'}</td>
                          <td className="p-3 whitespace-nowrap">
                            {item?.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3 font-medium">
                            {displayScore}%
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleView(item)}
                              className="px-3 py-1.5 text-sm sm:text-base text-white bg-[#34856C] hover:bg-[#2a6b5a] rounded-lg transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No test data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
