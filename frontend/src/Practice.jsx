import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/appContext";
import { ReactMic } from "react-mic";
import axios from "axios";
import toast from "react-hot-toast";

const Practice = () => {
  const { userDetails, setUserDetails } = useAppContext();

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
  };

  const handleSubmit = async () => {
    if (recordedChunks.length === 0) {
      toast.error("No voice recorded!");
      return;
    }

    if (userDetails.credits < 10) {
      toast.error("Credits not enough!");
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
      toast.success("Practice session completed successfully!");
      
      // Update user credits
      setUserDetails(prev => ({
        ...prev,
        credits: prev.credits - 10
      }));

    } catch (error) {
      console.error("Error submitting practice:", error);
      toast.error("Error submitting practice session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFA] overflow-y-scroll p-4 sm:p-8 h-[89svh] space-y-4 sm:space-y-8">
      <h1
        style={{ fontFamily: "Poppins" }}
        className="font-semibold text-[24px] sm:text-[32px]"
      >
        Practice Session
      </h1>
      
      <div className="p-[20px] sm:p-[40px] space-y-[30px] bg-white rounded-lg">
        <div className="text-center space-y-4">
          <h2
            style={{ fontFamily: "Poppins" }}
            className="text-[#34856C] leading-10 text-[32px] font-semibold"
          >
            Speak on any topic for <span className="text-[#FF6B5B]">60</span>{" "}
            seconds
          </h2>
          <p
            style={{ fontFamily: "Inter" }}
            className="text-[18px] text-[#5F6C7B]"
          >
            Suggestion: What was the most memorable incident that happened in
            this month?
          </p>
        </div>
        
        <div
          style={{ fontFamily: "Inter" }}
          className="flex text-[18px] justify-between h-[155px] border-[1px] rounded-lg border-[#D9E0E6] pl-[40px] pr-[40px] pt-[20px] pb-[20px] items-center"
        >
          <span className="text-2xl font-bold">{`0 : ${seconds.toString().padStart(2, '0')}`}</span>
          <div className="flex flex-col items-center space-y-2">
            <ReactMic record={isRecording} onStop={handleAudioSave} />
            <button
              onClick={() => setIsRecording((prev) => !prev)}
              disabled={seconds === 0 || isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={recordedChunks.length === 0 || isLoading}
            className="bg-[#34856C] hover:bg-[#2a6b56] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? "Processing..." : "Submit Practice Session"}
          </button>
        </div>
        
        {recordedChunks.length > 0 && (
          <div className="text-center text-green-600 font-semibold">
            ✓ {recordedChunks.length} audio segment(s) recorded
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;