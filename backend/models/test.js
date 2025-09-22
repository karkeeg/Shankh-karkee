const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        orgId: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        language: {
            type: String,
        },
        detected_language: {
            type: String
        },
        overallScore: {
            type: Number,
        },
        
        // Voice Clarity Score
        vcs: {
            type: Object,
            default: {}
        },
        
        // Voice Emotion Recognition Score
        vers: {
            type: Object,
            default: {}
        },
        
        // Voice Confidence Score
        voice_confidence: {
            type: Object,
            default: {}
        },
        
        // Voice Pitch Score
        vps: {
            type: Object,
            default: {}
        },
        
        // Voice Engagement Score
        ves: {
            type: Object,
            default: {}
        },
        
        // Raw voice insights
        voiceInsights: {
            type: Object,
            default: {}
        },
        
        // Behavioral insights
        behaviorInsights: {
            type: Object,
            default: {}
        },
        
        // Filler words analysis
        filler_words: {
            type: Object,
            default: {}
        },
        
        // Speech rate analysis
        speech_rate: {
            type: Object,
            default: {}
        },
        
        // Pitch analysis
        pitch_analysis: {
            type: Object,
            default: {}
        },
        
        // Tone analysis
        tone: {
            type: Object,
            default: {}
        },
        
        // Fluency analysis
        fluency: {
            type: Object,
            default: {}
        },
        
        // Raw transcript
        transcript: {
            type: String,
            required: true
        },
        
        // Raw API response for reference
        raw_response: {
            type: Object,
            default: {}
        },
        
        // Timestamp
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)


const Test = mongoose.model("Tests", testSchema);


module.exports = {Test};