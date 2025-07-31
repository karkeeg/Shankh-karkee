import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import { ReactMic } from "react-mic";
import Loader from "../User/Loader";
import axios from "axios";
import Onboarding1 from "./Onboarding1";
import Results from "../User/Results";
import toast from "react-hot-toast";

const Onboarding9 = () => {
  const { userDetails, setSelectedTest, setTranscript, setUserDetails, setPage } =
    useAppContext();

  const [resultOut, setResultOut] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize for ReactMic responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      toast.error("No voice recorded!");
      return;
    }

    if (userDetails.credits < 10) {
      toast.error("Credits not enough !");
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
      setResultOut(true);
    } catch (error) {
      console.error(
        "Transcription error:",
        error.response?.data?.detail || error.message
      );
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
    <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8 h-[75svh] w-full space-y-4">
      {!resultOut && isLoading == false ? (
        <div className="flex w-full max-w-[1007px] items-start text-start flex-col space-y-[20px] sm:space-y-[30px] lg:space-y-[45px] justify-center">
          <div className="rounded-2xl w-full max-w-[1007px] text-center shadow-md space-y-[20px] sm:space-y-[30px] lg:space-y-[42px] pb-[20px] sm:pb-[25px] lg:pb-[29px] pr-[15px] sm:pr-[20px] lg:pr-[24px] pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[20px] lg:pl-[24px] flex flex-col bg-white">
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[20px] sm:text-[24px] lg:text-[32px] font-semibold break-words"
            >
              Speak on any topic for{" "}
              <span className="text-[#FF6B5B] whitespace-nowrap">30 sec</span>
            </h1>
            <p
              style={{ fontFamily: "Inter" }}
              className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] px-2 sm:px-4 lg:px-0 break-words leading-relaxed"
            >
              Suggestion: What was the most memorable incident that happened in this month?
            </p>
            
            {/* Recording Container - Made Responsive */}
            <div
              style={{ fontFamily: "Inter" }}
              className="flex flex-col sm:flex-row text-[14px] sm:text-[16px] lg:text-[18px] justify-between min-h-[200px] sm:h-[180px] lg:h-[155px] border-[1px] rounded-lg border-[#D9E0E6] p-[15px] sm:p-[20px] lg:p-[40px] items-center space-y-4 sm:space-y-0"
            >
              {/* Timer */}
              <div className='flex flex-col items-center sm:items-start'>
                <span className='text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-[#34856C] whitespace-nowrap'>{`0 : ${seconds.toString().padStart(2, '0')}`}</span>
                <span className='text-[12px] sm:text-[14px] text-gray-500 mt-1'>Timer</span>
              </div>
              
              {/* Recording Controls */}
              <div className='flex flex-col items-center space-y-3'>
                {/* ReactMic Container - Made Responsive */}
                <div className='w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]'>
                  <ReactMic
                    record={isRecording}
                    onStop={handleAudioSave}
                    className="w-full h-auto"
                    strokeColor="#34856C"
                    backgroundColor="#f8f9fa"
                    width={windowWidth < 640 ? 200 : windowWidth < 1024 ? 250 : 300}
                    height={windowWidth < 640 ? 60 : windowWidth < 1024 ? 80 : 100}
                  />
                </div>
                
                {/* Recording Button */}
                <button
                  onClick={() => setIsRecording((prev) => !prev)}
                  disabled={seconds === 0}
                  className='bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg text-[14px] sm:text-[16px] font-semibold transition-colors min-w-[100px] sm:min-w-[120px] whitespace-nowrap'
                >
                  {isRecording ? "Stop" : "Start"}
                </button>
              </div>
              
              {/* Reset Button */}
              <div className='flex flex-col items-center sm:items-end'>
                <button
                  onClick={handleReset}
                  className='bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg text-[14px] sm:text-[16px] font-semibold transition-colors min-w-[100px] sm:min-w-[120px] whitespace-nowrap'
                >
                  Reset
                </button>
                <span className='text-[12px] sm:text-[14px] text-gray-500 mt-1 text-center'>Clear Recording</span>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="text-center w-full flex justify-center">
            <button
              style={{ fontFamily: "Poppins" }}
              className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[18px] lg:text-[20px] font-semibold w-full max-w-[287px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors whitespace-nowrap"
              onClick={handleSubmit}
            >
              Take Assessment
            </button>
          </div>
        </div>
      ) : !resultOut && isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-4 items-center w-full max-w-[600px]">
          <Results />
          <NavLink
            style={{ fontFamily: "Poppins" }}
            className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[18px] w-full max-w-[149px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors whitespace-nowrap"
            onClick={() => setPage((prev) => prev + 1)}
            to={"/userDashboard"}
          >
            Finish
          </NavLink>
        </div>
      )}
    </div>
  );
};
export default Onboarding9;
