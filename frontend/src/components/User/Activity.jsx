import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import { ReactMic } from "react-mic";
import Loader from "./Loader";
import axios from "axios";

const Activity = ({ setStatus }) => {
  const { userDetails, setSelectedTest, setTranscript, setUserDetails } =
    useAppContext();
  console.log(setStatus);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    let timer;
    if (isRecording && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRecording(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleAudioSave = async (recordedBlob) => {
    console.log("Recorded segment:", recordedBlob);
    setRecordedChunks((prevChunks) => [...prevChunks, recordedBlob.blob]);
    const mimeType = recordedBlob.blob.type;
    const fileExtension = mimeType.includes("mp3")
      ? "mp3"
      : mimeType.includes("wav")
      ? "wav"
      : "webm";

    const timestamp = recordedBlob.startTime;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const audioFile = new File([recordedBlob.blob], "recording.wav", {
      type: "audio/wav",
    });

    console.log("Audio File:", audioFile);
    setAudioFile(audioFile);

    console.log(formattedDate);
  };

  const handleReset = () => {
    setRecordedChunks([]);
    setIsRecording(false);
    setSeconds(60);
    setTranscript("");
  };

  const handleSubmit = async () => {
    if (recordedChunks.length === 0) {
      alert("No voice recorded!");
      return;
    }

    if (userDetails.credits < 10) {
      alert("Credits not enough !");
      return;
    }

    setIsLoading(true);

    const combinedBlob = new Blob(recordedChunks, { type: "audio/wav" });
    const audioFile = new File([combinedBlob], "combined_recording.wav", {
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

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
          fluency: response.data.fluency.fluency_score,
          toneModulation: response.data.tone.speech_dynamism_score,
          clarity: response.data.vcs["Voice Clarity Sore"],
          fillerWords: response.data.filler_words.filler_score,
        },
        behaviorInsights: {
          emotionalRegulation: response.data.vers["VERS Score"],
          confidenceAndPresence:
            response.data.voice_confidence["voice_confidence_score"],
          pacingAndPauses: response.data.vps["VPS"],
          engagement: response.data.ves["ves"],
        },
        fillerWordsUsed: response.data.filler_words.total_fillers,
        // Add detailed filler words data
        fillerWordsDetails: {
          counts: response.data.filler_words.filler_counts,
          totalFillers: response.data.filler_words.total_fillers,
          fillerScore: response.data.filler_words.filler_score,
          fillerRatePerMin: response.data.filler_words.filler_rate_per_min,
        },
        transcript: response.data.transcript,
        overallScore: response.data.sank_score,
      };

      console.log(test);

      const [res, res2] = await Promise.all([
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/addTest`, test),
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/editCredits`, {
          _id: userDetails._id,
          credits: userDetails.credits - 10,
        }),
      ]);

      setSelectedTest(res.data.data);
      console.log(response);
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
        console.log(res);
        setUserDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  console.log(audioFile);

  return (
    <div className="bg-[#E7F0F0] overflow-y-scroll flex flex-col items-start p-3 sm:p-4 md:p-6 lg:p-8 h-[89svh] w-full space-y-3 sm:space-y-4">
      <h1
        style={{ fontFamily: "Poppins" }}
        className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[32px]"
      >
        Activity
      </h1>

      {isLoading === false ? (
        <div className="flex w-full flex-col space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-[37px] items-center">
          <div className="rounded-2xl w-full max-w-[1007px] shadow-md space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-[42px] p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col bg-white">
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-[#34856C] leading-tight sm:leading-normal text-lg sm:text-xl md:text-2xl lg:text-[32px] font-semibold px-2"
            >
              Speak on any topic for <span className="text-[#FF6B5B]">30</span>{" "}
              sec
            </h1>

            <p
              style={{ fontFamily: "Inter" }}
              className="text-sm sm:text-base md:text-[18px] text-[#5F6C7B] px-2 sm:px-4"
            >
              Suggestion: What was the most memorable incident that happened in
              this month?
            </p>

            <div
              style={{ fontFamily: "Inter" }}
              className="flex flex-col lg:flex-row w-full text-sm sm:text-base md:text-[18px] justify-between items-center border-[1px] rounded-lg border-[#D9E0E6] p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 lg:space-y-0 lg:space-x-6"
            >
              {/* Timer */}
              <div className="text-center lg:text-left w-full lg:w-auto">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">{`0 : ${seconds}`}</span>
              </div>

              {/* ReactMic and Start/Stop */}
              <div className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-auto flex justify-center min-w-0">
                  <div className="w-full max-w-[320px] sm:max-w-[320px] md:max-w-[440px]">
                    <ReactMic
                      record={isRecording}
                      onStop={handleAudioSave}
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsRecording((prev) => !prev)}
                  disabled={seconds === 0}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  {isRecording ? "Stop" : "Start"}
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Reset
              </button>
            </div>

            <span className="italic text-[#5F6C7B] text-xs sm:text-sm md:text-[14px] px-2">
              Note: Each Assessment charge is 10 credits
            </span>
          </div>

          {/* Take Assessment Button */}
          <div className="text-center w-full items-center px-2 sm:px-4">
            <button
              style={{ fontFamily: "Poppins" }}
              className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-sm sm:text-base md:text-[20px] font-semibold w-full sm:w-auto sm:px-8 md:px-12 py-2 sm:py-3 rounded-lg transition-colors"
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
