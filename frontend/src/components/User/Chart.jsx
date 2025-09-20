import React from 'react';
import { LineChart } from '@mui/x-charts';

const Chart = ({ testData }) => {
    // Ensure we have testData and it's an array
    if (!testData || !Array.isArray(testData)) {
        return <div>No data available</div>;
    }

    const dates = testData.map((item) => item.date || '');

    // Calculate voice insights score - handle both old and new data structures
    const voiceInsights = testData.map((item) => {
        // Try new structure first
        if (item.fluency || item.tone || item.filler_words || item.vcs) {
            const fluency = item.fluency?.fluency_score || 0;
            
            // Get clarity from vcs object
            let clarity = 0;
            if (item.vcs) {
                clarity = item.vcs['Voice Clarity Score'] || 
                         item.vcs['Voice Clarity Sore'] ||
                         (typeof item.vcs === 'object' ? 
                           Object.values(item.vcs).find(val => typeof val === 'number') : 
                           0) || 0;
            }
            
            const toneModulation = item.tone?.speech_dynamism_score || 0;
            const fillerWords = item.filler_words?.filler_score || 0;
            
            return Math.ceil((fluency + clarity + toneModulation + fillerWords) / 4);
        } 
        // Fall back to old structure
        else if (item.voiceInsights) {
            return Math.ceil(
                (item.voiceInsights.fluency || 0) + 
                (item.voiceInsights.fillerWords || 0) + 
                (item.voiceInsights.clarity || 0) + 
                (item.voiceInsights.toneModulation || 0)
            ) / 4;
        }
        return 0;
    });

    // Calculate behavior insights score - handle both old and new data structures
    const behaviorInsights = testData.map((item) => {
        // Try new structure first
        if (item.vers || item.voice_confidence || item.vps || item.ves) {
            const emotionalRegulation = item.vers?.["VERS Score"] || 0;
            const confidenceAndPresence = item.voice_confidence?.["voice_confidence_score"] || 0;
            const pacingAndPauses = item.vps?.["VPS"] || 0;
            const engagement = item.ves?.["ves"] || 0;
            
            return Math.ceil((emotionalRegulation + confidenceAndPresence + pacingAndPauses + engagement) / 4);
        } 
        // Fall back to old structure
        else if (item.behaviorInsights) {
            return Math.ceil(
                (item.behaviorInsights.emotionalRegulation || 0) + 
                (item.behaviorInsights.engagement || 0) + 
                (item.behaviorInsights.confidenceAndPresence || 0) + 
                (item.behaviorInsights.pacingAndPauses || 0)
            ) / 4;
        }
        return 0;
    });

    const totalScore = testData.map((item) => item.overallScore || 0);

  return (
    <div className='p-2 text-center flex rounded-xl bg-white drop-shadow-lg'>
        <LineChart
            xAxis={[{ data: dates, scaleType: 'point'}]}
            yAxis={[
            {
                min: 0,
                max: 100,
                tickMinStep: 25,
                tickValues: [0, 25, 50, 75, 100], // explicitly set Y-axis ticks
            },
            ]}
            grid={{ vertical: true, horizontal: true }}
            series={[
            {
                data: totalScore,
                label : "Total Score",
                position: 'bottom'
            },
            {
                data: voiceInsights,
                label : "Voice Insights"
            },
            
            {
                data: behaviorInsights,
                label : "Behaviour Insights"
            },
            ]}
            width={1044}
            height={504}
        />
    </div>
  )
}

export default Chart
