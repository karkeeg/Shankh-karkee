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
    console.log('Starting voice analysis...');
    console.log('Audio file size:', (recordedChunks[0].size / 1024).toFixed(2), 'KB');

    const audioFile = new File([recordedChunks[0]], "recording.wav", {
      type: "audio/wav",
    });

    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", "en");
      console.log('Sending request to API...');

      const response = await axios.post(
        "https://api.shankh.ai/analyze_all/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Log the complete response structure
      console.group('=== VOICE ANALYSIS RESULTS ===');
      console.log('Full API Response:', response.data);
      
      // Log detected language
      console.log('\n=== LANGUAGE ===');
      console.log('Detected Language:', response.data.detected_language || response.data['Detected Language']);
      
      // Log voice clarity scores
      console.log('\n=== VOICE CLARITY ===');
      console.log('Voice Clarity Score:', response.data.vcs?.['Voice Clarity Score'] || 'N/A');
      console.log('Voice Clarity Breakdown:', response.data.vcs || 'N/A');
      
      // Log fluency metrics
      console.log('\n=== FLUENCY ===');
      console.log('Fluency Score:', response.data.fluency?.fluency_score || 'N/A');
      console.log('Fluency Breakdown:', response.data.fluency || 'N/A');
      
      // Log tone analysis
      console.log('\n=== TONE ANALYSIS ===');
      console.log('Tone Modulation:', response.data.tone || 'N/A');
      
      // Log speech rate and other metrics
      console.log('\n=== SPEECH METRICS ===');
      console.log('Speech Rate (WPM):', response.data.speech_rate?.words_per_minute || 'N/A');
      console.log('Pitch Analysis:', response.data.pitch_analysis || 'N/A');
      
      // Log filler words
      console.log('\n=== FILLER WORDS ===');
      console.log('Filler Words Detected:', response.data.filler_words || 'N/A');
      
      // Log behavior insights if available
      if (response.data.behavior_insights) {
        console.log('\n=== BEHAVIORAL INSIGHTS ===');
        console.log('Behavior Insights:', response.data.behavior_insights);
      }
      
      console.groupEnd();
      
      // Save the complete response for debugging
      window.lastVoiceAnalysis = response.data;

      // Create test object with all data from the API response
      const test = {
        // Basic info
        userId: userDetails._id,
        orgId: userDetails.orgId,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        
        // Language information
        language: response.data.language,
        detected_language: response.data.detected_language || response.data["Detected Language"],
        
        // Overall score
        overallScore: response.data.sank_score,
        
        // Voice Clarity Score
        vcs: response.data.vcs || {},
        
        // Voice Emotion Recognition Score
        vers: response.data.vers || {},
        
        // Voice Confidence Score
        voice_confidence: response.data.voice_confidence || {},
        
        // Voice Pitch Score
        vps: response.data.vps || {},
        
        // Voice Engagement Score
        ves: response.data.ves || {},
        
        // Raw voice insights (compatibility with existing code)
        voiceInsights: {
          fluency: response.data.fluency?.fluency_score || 0,
          toneModulation: response.data.tone?.speech_dynamism_score || 0,
          clarity: (() => {
            const clarityValue = 
              response.data.vcs?.['Voice Clarity Score'] ||
              response.data.vcs?.['Voice Clarity Sore'] ||
              (response.data.vcs && typeof response.data.vcs === 'object' ? 
                Object.values(response.data.vcs).find(val => typeof val === 'number') : 
                null);
            return Number(clarityValue) || 0;
          })(),
          fillerWords: response.data.filler_words?.filler_score || 0,
        },
        
        // Behavioral insights (compatibility with existing code)
        behaviorInsights: {
          emotionalRegulation: response.data.vers?.["VERS Score"],
          confidenceAndPresence: response.data.voice_confidence?.["voice_confidence_score"],
          pacingAndPauses: response.data.vps?.["VPS"],
          engagement: response.data.ves?.["ves"],
        },
        
        // Filler words detailed info
        filler_words: response.data.filler_words || {},
        
        // Speech rate analysis
        speech_rate: response.data.speech_rate || {},
        
        // Pitch analysis
        pitch_analysis: response.data.pitch_analysis || {},
        
        // Tone analysis
        tone: response.data.tone || {},
        
        // Fluency analysis
        fluency: response.data.fluency || {},
        
        // Transcript
        transcript: response.data.transcript || "",
        
        // Store the complete raw response for reference
        raw_response: response.data
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
