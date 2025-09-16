import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import Loader from "./Loader";
import axios from "axios";

const Activity = ({ setStatus }) => {
  const { userDetails, setSelectedTest, setTranscript, setUserDetails } =
    useAppContext();

  const [seconds, setSeconds] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const recorderControls = useAudioRecorder();

  // countdown timer
  useEffect(() => {
    let timer;
    if (recorderControls.isRecording && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            recorderControls.stopRecording(); // ⏹ stop when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recorderControls.isRecording, seconds]);

  // save recording blob
  const handleAudioSave = (blob) => {
    console.log("Recorded Blob:", blob);
    setRecordedChunks([blob]); // keep the latest blob
  };

  const handleReset = () => {
    setRecordedChunks([]);
    setSeconds(60);
    setTranscript("");
    if (recorderControls.isRecording) {
      recorderControls.stopRecording();
    }
  };

  const handleSubmit = async () => {
    if (!recordedChunks.length) {
      alert("No voice recorded!");
      return;
    }

    if (userDetails.credits < 10) {
      alert("Credits not enough!");
      return;
    }

    setIsLoading(true);

    const audioFile = new File([recordedChunks[0]], "recording.wav", {
      type: "audio/wav",
    });

    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", "en");

      const response = await axios.post(
        "https://api.shankh.ai/analyze_all/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log('API Response:', JSON.stringify(response.data, null, 2));
      console.log('VCS Data:', response.data.vcs);

      const test = {
        userId: userDetails._id,
        orgId: userDetails.orgId,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        language:
          response.data["detected_language"] ||
          response.data["Detected Language"],
        voiceInsights: {
          fluency: response.data.fluency?.fluency_score || 0,
          toneModulation: response.data.tone?.speech_dynamism_score || 0,
          clarity: (() => {
            // Try all possible variations of the clarity score
            const clarityValue = 
              response.data.vcs?.['Voice Clarity Score'] ||
              response.data.vcs?.['Voice Clarity Sore'] ||
              (response.data.vcs && typeof response.data.vcs === 'object' ? 
                Object.values(response.data.vcs).find(val => typeof val === 'number') : 
                null);
            
            console.log('Extracted clarity value:', clarityValue);
            // Ensure we return a number, default to 0 if not found
            const finalValue = Number(clarityValue) || 0;
            console.log('Final clarity value:', finalValue);
            return finalValue;
          })(),
          fillerWords: response.data.filler_words?.filler_score || 0,
        },
        behaviorInsights: {
          emotionalRegulation: response.data.vers["VERS Score"],
          confidenceAndPresence:
            response.data.voice_confidence["voice_confidence_score"],
          pacingAndPauses: response.data.vps["VPS"],
          engagement: response.data.ves["ves"],
        },
        fillerWordsUsed: response.data.filler_words.total_fillers,
        fillerWordsDetails: {
          counts: response.data.filler_words.filler_counts,
          totalFillers: response.data.filler_words.total_fillers,
          fillerScore: response.data.filler_words.filler_score,
          fillerRatePerMin: response.data.filler_words.filler_rate_per_min,
        },
        transcript: response.data.transcript,
        overallScore: response.data.sank_score,
      };

      const [res, res2] = await Promise.all([
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/addTest`, test),
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/editCredits`, {
          _id: userDetails._id,
          credits: userDetails.credits - 10,
        }),
      ]);

      setSelectedTest(res.data.data);
      setStatus("results");
    } catch (error) {
      console.error("Error:", error.response?.data?.detail || error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/getUser`,
          userDetails
        );
        setUserDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#E7F0F0] overflow-y-scroll flex flex-col items-start p-4 sm:p-6 lg:p-8 h-[89svh] w-full lg:w-[calc(100vw-300px)] space-y-4">
      <h1
        style={{ fontFamily: "Poppins" }}
        className="font-semibold text-[24px] sm:text-[28px] lg:text-[32px] w-full text-center lg:text-left"
      >
        Activity
      </h1>

      {isLoading === false ? (
        <div className="flex w-full items-start text-start flex-col space-y-[20px] sm:space-y-[30px] lg:space-y-[37px] justify-center">
          <div className="rounded-2xl w-full max-w-[1007px] text-center shadow-md space-y-[20px] sm:space-y-[30px] lg:space-y-[42px] pb-[20px] sm:pb-[25px] lg:pb-[29px] pr-[15px] sm:pr-[20px] lg:pr-[24px] pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[20px] lg:pl-[24px] flex flex-col bg-white">
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[20px] sm:text-[24px] lg:text-[32px] font-semibold"
            >
              Speak on any topic for <span className="text-[#FF6B5B]">30</span>{" "}
              sec
            </h1>
            <p
              style={{ fontFamily: "Inter" }}
              className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] px-2 sm:px-4 lg:px-0"
            >
              Suggestion: What was the most memorable incident that happened in
              this month?
            </p>

            {/* Recording Container */}
            <div
              style={{ fontFamily: "Inter" }}
              className="flex flex-col sm:flex-row text-[14px] sm:text-[16px] lg:text-[18px] justify-between min-h-[200px] sm:h-[180px] lg:h-[255px] border-[1px] rounded-lg border-[#D9E0E6] p-[15px] sm:p-[20px] lg:p-[40px] items-center space-y-4 sm:space-y-0"
            >
              {/* Timer */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-[#34856C]">
                  {`0 : ${seconds.toString().padStart(2, "0")}`}
                </span>
                <span className="text-[12px] sm:text-[14px] text-gray-500 mt-1">
                  Timer
                </span>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-full max-w-[250px]">
                  <AudioRecorder
                    onRecordingComplete={handleAudioSave}
                    recorderControls={recorderControls}
                    classes={{
                      AudioRecorderClass: "w-full",
                      AudioRecorderCanvasClass: "w-full h-[80px]",
                    }}
                  />
                </div>

                <button
                  onClick={() =>
                    recorderControls.isRecording
                      ? recorderControls.stopRecording()
                      : recorderControls.startRecording()
                  }
                  disabled={seconds === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg text-[16px] font-semibold transition-colors min-w-[120px]"
                >
                  {recorderControls.isRecording ? "Stop" : "Start"}
                </button>
              </div>

              {/* Reset */}
              <div className="flex flex-col items-center sm:items-end">
                <button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-[16px] font-semibold transition-colors min-w-[120px]"
                >
                  Reset
                </button>
                <span className="text-[12px] sm:text-[14px] text-gray-500 mt-1">
                  Clear Recording
                </span>
              </div>
            </div>

            <span className="italic text-[#5F6C7B] text-[12px] sm:text-[13px] lg:text-[14px] text-center">
              Note: Each Assessment charge is 10 credits
            </span>
          </div>

          <div className="text-center w-full flex justify-center">
            <button
              style={{ fontFamily: "Poppins" }}
              className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[18px] font-semibold w-full max-w-[287px] py-[10px] rounded-lg transition-colors"
              onClick={handleSubmit}
            >
              Take Assessment
            </button>
          </div>
        </div>
      ) : (
        <Loader isLoading={isLoading} />
      )}
    </div>
  );
};

export default Activity;
