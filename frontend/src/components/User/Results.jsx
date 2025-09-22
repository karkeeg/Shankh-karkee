import React, { useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import SpiderChart from "../../SpiderChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-bold">Something went wrong</h3>
          <p className="text-sm">{String(this.state.error)}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// SafeRender component to handle rendering with error boundaries
const SafeRender = ({ children, fallback = null }) => {
  try {
    const content = typeof children === 'function' ? children() : children;
    return <ErrorBoundary>{content}</ErrorBoundary>;
  } catch (error) {
    console.error('Error in SafeRender:', error);
    return fallback;
  }
};

// Helper function to safely convert a value to a string, handling Buffer objects
const safeToString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (value.buffer) return Buffer.from(value.buffer).toString('utf-8');
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.warn('Could not stringify value:', value, e);
    return String(value);
  }
};

// Helper function to safely convert a value to a number, handling Buffer objects
const safeToNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  
  let strValue;
  if (value.buffer) {
    strValue = Buffer.from(value.buffer).toString('utf-8');
  } else {
    strValue = String(value);
  }
  
  const num = parseFloat(strValue);
  return isNaN(num) ? defaultValue : num;
};

// Helper function to recursively sanitize any object
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle Buffer objects
  if (obj.buffer && obj.buffer instanceof ArrayBuffer) {
    return safeToNumber(obj);
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  // Handle plain objects
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // Skip special keys that might cause issues
      if (key.startsWith('_') && key !== '_id') continue;
      
      if (value && typeof value === 'object') {
        result[key] = sanitizeObject(value);
      } else {
        // For primitive values, ensure they're in a safe format
        if (typeof value === 'string' && !isNaN(Number(value))) {
          result[key] = safeToNumber(value);
        } else {
          result[key] = value;
        }
      }
    }
  }
  return result;
};

// Main function to sanitize test data
const sanitizeTestData = (testData) => {
  if (!testData) return {};
  
  try {
    // First, create a deep copy to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(testData));
    
    // Process voiceInsights
    if (sanitized.voiceInsights) {
      Object.keys(sanitized.voiceInsights).forEach(key => {
        sanitized.voiceInsights[key] = safeToNumber(sanitized.voiceInsights[key]);
      });
    }
    
    // Process behaviorInsights
    if (sanitized.behaviorInsights) {
      Object.keys(sanitized.behaviorInsights).forEach(key => {
        sanitized.behaviorInsights[key] = safeToNumber(sanitized.behaviorInsights[key]);
      });
    }
    
    // Ensure overallScore is a number
    if (sanitized.overallScore !== undefined) {
      sanitized.overallScore = safeToNumber(sanitized.overallScore);
    }
    
    // Sanitize any nested objects
    return sanitizeObject(sanitized);
    
  } catch (error) {
    console.error('Error sanitizing test data:', error);
    // Return a safe empty object if there's an error
    return {
      voiceInsights: {},
      behaviorInsights: {},
      overallScore: 0,
      date: new Date().toISOString(),
      _id: 'error'
    };
  }
};

// Helper function to safely render any value in JSX
const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  
  try {
    // Handle Buffer objects
    if (value.buffer) {
      return Buffer.from(value.buffer).toString('utf-8');
    }
    
    // Handle dates
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return new Date(value).toLocaleDateString();
    }
    
    // Handle objects and arrays
    if (typeof value === 'object') {
      // Skip rendering complex objects directly
      if (Array.isArray(value) || Object.keys(value).length > 0) {
        return JSON.stringify(value);
      }
      return fallback;
    }
    
    // Handle primitive values
    return String(value);
    
  } catch (error) {
    console.warn('Error rendering value:', value, error);
    return fallback;
  }
};

const ResultsContent = () => {
  const { userDetails, transcript, selectedTest: rawSelectedTest } = useAppContext();
  
  // Sanitize the selectedTest data
  const selectedTest = React.useMemo(() => sanitizeTestData(rawSelectedTest), [rawSelectedTest]);

  console.log("Sanitized test data:", selectedTest);
  if (selectedTest.voiceInsights) {
    console.log("Sanitized clarity type:", typeof selectedTest.voiceInsights.clarity);
  }

  // Add null checks to prevent errors when selectedTest is empty
  if (
    !selectedTest ||
    !selectedTest.voiceInsights ||
    !selectedTest.behaviorInsights
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[75svh] w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Test Data Available
          </h2>
          <p className="text-gray-500">
            Please complete a voice assessment to view result.
          </p>
        </div>
      </div>
    );
  }

  const page1Ref = useRef();
  const page2Ref = useRef();

  const handleDownload = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pdfWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with proper wrapping
    const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * (fontSize * 0.4); // Return height used
    };

    // Helper function to add section header
    const addSectionHeader = (text, y) => {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(52, 133, 108); // #34856C
      pdf.text(text, margin, y);
      return y + 8;
    };

    // Helper function to add subsection header
    const addSubsectionHeader = (text, y) => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(text, margin, y);
      return y + 6;
    };

    // Helper function to add normal text
    const addNormalText = (text, y, fontSize = 12) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      return addWrappedText(text, margin, y, contentWidth, fontSize);
    };

    // Helper function to add score with color
    const addScore = (label, score, y) => {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}: `, margin, y);

      // Color based on score
      if (score <= 39) {
        pdf.setTextColor(255, 107, 91); // #FF6B5B
      } else if (score <= 69) {
        pdf.setTextColor(249, 168, 38); // #F9A826
      } else {
        pdf.setTextColor(52, 133, 108); // #34856C
      }

      pdf.text(`${Math.ceil(score)}%`, margin + 30, y);
      pdf.setTextColor(0, 0, 0);
      return y + 6;
    };

    // Helper function to ensure a value is a string
    const ensureString = (value) => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') {
        if (value.buffer) {
          // Handle Buffer objects
          return Buffer.from(value.buffer).toString();
        }
        return JSON.stringify(value);
      }
      return String(value);
    };

    // Helper function to create a table
    const createTable = (headers, data, startY, colWidths) => {
      const rowHeight = 8;
      const headerHeight = 10;

      // Draw table border
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);

      // Draw headers
      pdf.setFillColor(52, 133, 108); // #34856C
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);

      let currentX = margin;
      headers.forEach((header, index) => {
        pdf.rect(currentX, startY, colWidths[index], headerHeight, "F");
        pdf.text(ensureString(header), currentX + 2, startY + 6);
        currentX += colWidths[index];
      });

      // Draw data rows
      pdf.setFillColor(248, 250, 250); // #F8FAFA
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");

      data.forEach((row, rowIndex) => {
        const rowY = startY + headerHeight + rowIndex * rowHeight;
        currentX = margin;

        row.forEach((cell, cellIndex) => {
          const bgColor =
            rowIndex % 2 === 0 ? [248, 250, 250] : [255, 255, 255];
          pdf.setFillColor(...bgColor);
          pdf.rect(currentX, rowY, colWidths[cellIndex], rowHeight, "F");
          pdf.text(ensureString(cell), currentX + 2, rowY + 5);
          currentX += colWidths[cellIndex];
        });
      });

      // Draw borders
      currentX = margin;
      headers.forEach((_, index) => {
        pdf.rect(
          currentX,
          startY,
          colWidths[index],
          headerHeight + data.length * rowHeight,
          "S"
        );
        currentX += colWidths[index];
      });

      return startY + headerHeight + data.length * rowHeight + 10;
    };

    // Helper function to ensure a value is a number
    const ensureNumber = (value) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === 'object' && value.buffer) {
        // Handle Buffer objects
        return Number(Buffer.from(value.buffer).toString()) || 0;
      }
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Helper function to create a radar chart
    const createRadarChart = (
      data,
      centerX,
      centerY,
      radius,
      title,
      startY
    ) => {
      const filteredData = Object.entries(data)
        .filter(([key]) => key !== '_id' && key !== '__v')
        .reduce((acc, [key, value]) => {
          acc[key] = ensureNumber(value);
          return acc;
        }, {});
      
      const angleStep = (2 * Math.PI) / Object.keys(filteredData).length;
      const angles = Object.keys(filteredData).map((_, index) => index * angleStep);
      const labels = Object.keys(filteredData);
      const values = Object.values(filteredData);

      // Draw title
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(52, 133, 108);
      pdf.text(title, centerX - 20, startY);

      // Draw radar grid
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);

      // Draw concentric circles
      for (let i = 1; i <= 5; i++) {
        const currentRadius = (radius * i) / 5;
        pdf.circle(centerX, centerY, currentRadius, "S");
      }

      // Draw radial lines
      angles.forEach((angle) => {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        pdf.line(centerX, centerY, x, y);
      });

      // Draw data points and fill area
      const points = angles.map((angle, index) => {
        const value = values[index] / 100; // Normalize to 0-1
        const r = radius * value;
        return {
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
        };
      });

      // Draw radar area outline (don't fill to avoid black screen)
      pdf.setDrawColor(52, 133, 108);
      pdf.setLineWidth(1);

      pdf.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        pdf.lineTo(point.x, point.y);
      });
      pdf.lineTo(points[0].x, points[0].y);
      pdf.stroke();

      // Draw data points
      points.forEach((point) => {
        pdf.setFillColor(52, 133, 108);
        pdf.circle(point.x, point.y, 2, "F");
      });

      // Draw labels
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      angles.forEach((angle, index) => {
        const labelRadius = radius + 20;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);

        // Adjust text position based on angle for better readability
        let textX = x;
        let textY = y;

        if (angle >= 0 && angle < Math.PI / 2) {
          textX = x - 5;
          textY = y - 5;
        } else if (angle >= Math.PI / 2 && angle < Math.PI) {
          textX = x - 15;
          textY = y - 5;
        } else if (angle >= Math.PI && angle < (3 * Math.PI) / 2) {
          textX = x - 15;
          textY = y + 5;
        } else {
          textX = x - 5;
          textY = y + 5;
        }

        pdf.text(labels[index], textX, textY);
      });

      return startY + radius * 2 + 30;
    };

    // Helper function to create a bar chart
    const createBarChart = (data, startX, startY, width, height, title) => {
      // Filter and convert data to ensure all values are numbers
      const filteredData = Object.entries(data)
        .filter(([key]) => key !== '_id' && key !== '__v')
        .reduce((acc, [key, value]) => {
          acc[key] = ensureNumber(value);
          return acc;
        }, {});
      
      // Ensure we have at least one value to prevent division by zero
      const maxValue = Math.max(1, ...Object.values(filteredData));
      const barCount = Object.keys(filteredData).length || 1;
      const barWidth = Math.min(30, (width - (barCount - 1) * 5) / barCount); // Max bar width 30, min spacing 5
      const barSpacing = barCount > 1 ? (width - barCount * barWidth) / (barCount - 1) : 0;

      // Draw title
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(52, 133, 108);
      pdf.text(title, startX, startY);

      // Draw bars
      Object.entries(filteredData).forEach(([label, value], index) => {
        const barHeight = (value / maxValue) * height;
        const x = startX + index * (barWidth + barSpacing);
        const y = startY + 15 + (height - barHeight);

        // Ensure value is a number
        const numValue = ensureNumber(value);
        
        // Color based on value
        if (numValue <= 39) {
          pdf.setFillColor(255, 107, 91); // #FF6B5B
        } else if (numValue <= 69) {
          pdf.setFillColor(249, 168, 38); // #F9A826
        } else {
          pdf.setFillColor(52, 133, 108); // #34856C
        }

        pdf.rect(x, y, barWidth, barHeight, "F");

        // Draw value on bar (only if there's enough space)
        if (barHeight > 15) {
          pdf.setFontSize(8);
          pdf.setTextColor(255, 255, 255);
          pdf.text(
            `${Math.ceil(numValue)}%`,
            x + barWidth / 2 - 8,
            y + barHeight / 2 + 2
          );
        }

        // Draw label (truncate if too long)
        const maxLabelLength = Math.floor(barWidth / 2);
        const displayLabel = label.length > maxLabelLength 
          ? `${label.substring(0, maxLabelLength - 1)}…` 
          : label;
          
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(displayLabel, x, startY + 15 + height + 5, {
          maxWidth: barWidth,
          align: 'center'
        });
      });

      return startY + height + 40;
    };

    // Page 1: Header and Overview
    // ============================

    // Title
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(52, 133, 108); // #34856C
    pdf.text("Shankh Voice Assessment Report", margin, yPosition);
    yPosition += 15;

    // Test Information Table
    yPosition = addSectionHeader("Test Information", yPosition);
    yPosition += 5;

    const testInfoHeaders = ["Field", "Value"];
    const testInfoData = [
      ["Test ID", ensureString(selectedTest._id)],
      ["Date", ensureString(selectedTest.date)],
      ["Language", ensureString(selectedTest.language) || "Auto-detected"],
      ["Overall Score", `${Math.ceil(ensureNumber(selectedTest.overallScore))}%`],
    ].filter(([_, value]) => value !== undefined); // Remove any undefined values
    
    const testInfoWidths = [50, 110];
    yPosition = createTable(
      testInfoHeaders,
      testInfoData,
      yPosition,
      testInfoWidths
    );

    // User Information Table
    yPosition = addSectionHeader("User Information", yPosition);
    yPosition += 5;

    const userInfoHeaders = ["Field", "Value"];
    const userInfoData = [
      ["Name", ensureString(userDetails?.userName) || "Not specified"],
      ["Organization", ensureString(userDetails?.orgName) || "Not specified"],
      ["Location", ensureString(userDetails?.location) || "Not specified"],
      ["Occupation", ensureString(userDetails?.occupation) || "Not specified"],
    ].filter(([_, value]) => value !== undefined); // Remove any undefined values
    
    const userInfoWidths = [50, 110];
    yPosition = createTable(
      userInfoHeaders,
      userInfoData,
      yPosition,
      userInfoWidths
    );

    // Overall Score with Visual Indicator
    yPosition = addSectionHeader("Overall Assessment", yPosition);
    yPosition += 5;

    // Ensure overallScore is a number
    const overallScore = Math.ceil(ensureNumber(selectedTest.overallScore));
    let performanceLevel = "";

    if (overallScore <= 39) {
      performanceLevel = "Novice";
    } else if (overallScore <= 69) {
      performanceLevel = "Emerging";
    } else {
      performanceLevel = "Proficient";
    }

    // Create score visualization
    const scoreBarWidth = 120;
    const scoreBarHeight = 15;
    const scoreBarX = margin;
    const scoreBarY = yPosition;

    // Background bar
    pdf.setFillColor(240, 240, 240);
    pdf.rect(scoreBarX, scoreBarY, scoreBarWidth, scoreBarHeight, "F");

    // Score bar
    if (overallScore <= 39) {
      pdf.setFillColor(255, 107, 91); // #FF6B5B
    } else if (overallScore <= 69) {
      pdf.setFillColor(249, 168, 38); // #F9A826
    } else {
      pdf.setFillColor(52, 133, 108); // #34856C
    }

    const filledWidth = Math.min(Math.max(overallScore, 0), 100) / 100 * scoreBarWidth;
    pdf.rect(scoreBarX, scoreBarY, filledWidth, scoreBarHeight, "F");

    // Score text
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    
    // Ensure the score text fits within the page
    const scoreTextX = scoreBarX + scoreBarWidth + 10;
    const maxScoreTextX = pdf.internal.pageSize.width - margin - 30; // Leave 30pt margin on right
    
    if (scoreTextX < maxScoreTextX) {
      pdf.text(
        `${overallScore}%`,
        scoreTextX,
        scoreBarY + 10
      );
      pdf.text(
        `(${performanceLevel})`,
        scoreTextX,
        scoreBarY + 20
      );
    } else {
      // If there's not enough space, put it below the bar
      yPosition += scoreBarHeight + 5;
      pdf.text(
        `Score: ${overallScore}% (${performanceLevel})`,
        scoreBarX,
        yPosition
      );
    }

    yPosition += 30;

    // Performance Scale Table
    yPosition = addSubsectionHeader("Performance Scale", yPosition);
    yPosition += 5;

    const scaleHeaders = ["Level", "Range", "Description"];
    const scaleData = [
      ["Novice", "0-39%", "Basic understanding, needs significant improvement"],
      ["Emerging", "40-69%", "Developing skills, shows potential"],
      ["Proficient", "70-100%", "Strong performance, demonstrates mastery"],
    ];
    const scaleWidths = [30, 25, 105];
    yPosition = createTable(scaleHeaders, scaleData, yPosition, scaleWidths);

    // Helper function to get performance level
    const getPerformanceLevel = (score) => {
      const numScore = ensureNumber(score);
      if (numScore <= 39) return "Novice";
      if (numScore <= 69) return "Emerging";
      return "Proficient";
    };

    // Voice Insights Table
    yPosition = addSectionHeader("Voice Insights Summary", yPosition);
    yPosition += 5;

    const voiceHeaders = ["Parameter", "Score", "Level"];
    const voiceData = Object.entries(selectedTest.voiceInsights || {})
      .filter(([key]) => key !== '_id' && key !== '__v')
      .map(([key, value]) => {
        const numValue = ensureNumber(value);
        return [
          key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          `${Math.ceil(numValue)}%`,
          getPerformanceLevel(numValue)
        ];
      });

    const voiceWidths = [70, 30, 60];
    yPosition = createTable(voiceHeaders, voiceData, yPosition, voiceWidths);

    // Behavior Insights Table
    yPosition = addSectionHeader("Behavior Insights Summary", yPosition);
    yPosition += 5;

    const behaviorHeaders = ["Parameter", "Score", "Level"];
    const behaviorData = Object.entries(selectedTest.behaviorInsights || {})
      .filter(([key]) => key !== '_id' && key !== '__v')
      .map(([key, value]) => {
        const numValue = ensureNumber(value);
        return [
          key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          `${Math.ceil(numValue)}%`,
          getPerformanceLevel(numValue)
        ];
      });

    const behaviorWidths = [70, 30, 60];
    yPosition = createTable(
      behaviorHeaders,
      behaviorData,
      yPosition,
      behaviorWidths
    );

    // Filler Words Analysis
    yPosition = addSectionHeader("Filler Words Analysis", yPosition);
    yPosition += 5;

    // Ensure fillerWordsUsed is an object and handle potential buffer objects
    const fillerWordsUsed = selectedTest.fillerWordsUsed || {};
    const sanitizedFillerWords = Object.entries(fillerWordsUsed).reduce((acc, [key, value]) => {
      // Ensure the value is a number
      const numValue = ensureNumber(value);
      if (numValue > 0) {
        acc[key] = numValue;
      }
      return acc;
    }, {});

    const totalFillers = Object.values(sanitizedFillerWords).reduce(
      (a, b) => a + b,
      0
    );
    
    yPosition += addNormalText(
      `Total Filler Words Used: ${totalFillers}`,
      yPosition
    );
    yPosition += 10;

    if (Object.keys(sanitizedFillerWords).length > 0) {
      // Filler Words Bar Chart - show top 5 most used filler words
      const sortedFillers = Object.entries(sanitizedFillerWords)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      const fillerData = Object.fromEntries(sortedFillers);
      yPosition = createBarChart(
        fillerData,
        margin,
        yPosition,
        150,
        60,
        "Most Used Filler Words"
      );
    } else {
      yPosition += addNormalText(
        "No filler words detected in this recording.",
        yPosition
      );
      yPosition += 10;
    }

    // Check if we need a new page
    if (yPosition > pdfHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    // Page 2: Visual Analysis
    // =======================

    // Voice Insights Radar Chart
    yPosition = addSectionHeader("Voice Insights Radar Chart", yPosition);
    yPosition += 10;

    const voiceCenterX = margin + 80;
    const voiceCenterY = yPosition + 45;
    const voiceRadius = 40;
    yPosition = createRadarChart(
      selectedTest.voiceInsights,
      voiceCenterX,
      voiceCenterY,
      voiceRadius,
      "Voice Mechanics",
      yPosition
    );

    // Check if we need a new page
    if (yPosition > pdfHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Behavior Insights Radar Chart
    yPosition = addSectionHeader("Behavior Insights Radar Chart", yPosition);
    yPosition += 10;

    const behaviorCenterX = margin + 80;
    const behaviorCenterY = yPosition + 45;
    const behaviorRadius = 40;
    yPosition = createRadarChart(
      selectedTest.behaviorInsights,
      behaviorCenterX,
      behaviorCenterY,
      behaviorRadius,
      "Behavior Psychology",
      yPosition
    );

    // Check if we need a new page
    if (yPosition > pdfHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Detailed Analysis Table
    yPosition = addSectionHeader("Detailed Parameter Analysis", yPosition);
    yPosition += 5;

    const analysisHeaders = ["Parameter", "Score", "Level", "Description"];
    
    // Parameter descriptions
    const parameterDescriptions = {
      // Voice Insights
      fluency: "Smooth speech without interruptions or hesitations",
      toneModulation: "Voice pitch, volume, and speed variation",
      clarity: "Clear and distinct pronunciation",
      fillerWords: "Minimal use of unnecessary words",
      
      // Behavior Insights
      emotionalRegulation: "Control and expression of emotions",
      confidenceAndPresence: "Self-assurance and attention command",
      pacingAndPauses: "Timing, rhythm, and strategic pauses",
      engagement: "Audience connection and interest maintenance"
    };
    
    // Process voice insights
    const voiceInsightsData = Object.entries(selectedTest.voiceInsights || {})
      .filter(([key]) => key in parameterDescriptions)
      .map(([key, value]) => {
        const numValue = ensureNumber(value);
        return {
          category: 'voice',
          key,
          name: key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          score: numValue,
          level: getPerformanceLevel(numValue),
          description: parameterDescriptions[key] || ""
        };
      });
    
    // Process behavior insights
    const behaviorInsightsData = Object.entries(selectedTest.behaviorInsights || {})
      .filter(([key]) => key in parameterDescriptions)
      .map(([key, value]) => {
        const numValue = ensureNumber(value);
        return {
          category: 'behavior',
          key,
          name: key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          score: numValue,
          level: getPerformanceLevel(numValue),
          description: parameterDescriptions[key] || ""
        };
      });
    
    // Combine and sort all parameters
    const allParameters = [...voiceInsightsData, ...behaviorInsightsData]
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Convert to table data format
    const analysisData = allParameters.map(param => [
      param.name,
      `${Math.ceil(param.score)}%`,
      param.level,
      param.description
    ]);
    
    const analysisWidths = [50, 20, 25, 85]; // Adjusted widths for better fit
    
    if (analysisData.length > 0) {
      yPosition = createTable(
        analysisHeaders,
        analysisData,
        yPosition,
        analysisWidths
      );
    } else {
      yPosition += addNormalText(
        "No detailed analysis data available.",
        yPosition
      );
      yPosition += 10;
    }

    // Check if we need a new page
    if (yPosition > pdfHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Recommendations
    yPosition = addSectionHeader("Personalized Recommendations", yPosition);
    yPosition += 5;

    const recommendations = [];

    // Helper function to add a recommendation if the score is below a threshold
    const addRecommendation = (score, threshold, message) => {
      const numScore = ensureNumber(score);
      if (numScore <= threshold) {
        recommendations.push(message);
      }
    };

    // Voice insights recommendations
    if (selectedTest.voiceInsights) {
      const vi = selectedTest.voiceInsights;
      
      addRecommendation(
        vi.fluency, 
        39, 
        "Practice speaking exercises to improve fluency and reduce hesitations"
      );
      
      addRecommendation(
        vi.clarity, 
        39, 
        "Focus on clear pronunciation and articulation exercises"
      );
      
      addRecommendation(
        vi.fillerWords, 
        39, 
        "Work on reducing filler words through conscious practice and awareness"
      );
      
      addRecommendation(
        vi.toneModulation,
        39,
        "Vary your tone, pitch, and volume to make your speech more engaging"
      );
    }

    // Behavior insights recommendations
    if (selectedTest.behaviorInsights) {
      const bi = selectedTest.behaviorInsights;
      
      addRecommendation(
        bi.confidenceAndPresence, 
        39, 
        "Build confidence through regular practice and positive self-talk"
      );
      
      addRecommendation(
        bi.engagement, 
        39, 
        "Practice audience engagement techniques and storytelling"
      );
      
      addRecommendation(
        bi.emotionalRegulation,
        39,
        "Work on managing your emotions and maintaining composure while speaking"
      );
      
      addRecommendation(
        bi.pacingAndPauses,
        39,
        "Practice controlling your speaking rate and using strategic pauses for emphasis"
      );
    }

    // Add a general recommendation if no specific ones were added
    if (recommendations.length === 0) {
      recommendations.push(
        "Continue practicing to maintain and further improve your excellent communication skills"
      );
    }

    // Limit the number of recommendations to keep the PDF manageable
    const maxRecommendations = 5;
    const limitedRecommendations = recommendations.slice(0, maxRecommendations);

    // Format recommendations for the table
    const recHeaders = ["Priority", "Recommendation"];
    const recData = limitedRecommendations.map((rec, index) => [
      `${index + 1}`, 
      ensureString(rec) // Ensure the recommendation is a string
    ]);
    
    const recWidths = [20, 140]; // Slightly wider second column for better text wrapping
    
    yPosition = createTable(recHeaders, recData, yPosition, recWidths);
    yPosition += 10;

    // Check if we need a new page for transcript
    if (yPosition > pdfHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Transcript
    yPosition = addSectionHeader("Speech Transcript", yPosition);
    yPosition += 5;

    // Ensure transcript is a string and handle potential buffer objects
    let transcriptText = "No transcript available";
    if (selectedTest.transcript) {
      if (typeof selectedTest.transcript === 'object' && selectedTest.transcript.buffer) {
        // Handle buffer objects
        transcriptText = Buffer.from(selectedTest.transcript.buffer).toString('utf-8');
      } else if (typeof selectedTest.transcript === 'string') {
        transcriptText = selectedTest.transcript;
      } else {
        // Fallback for other types
        transcriptText = String(selectedTest.transcript);
      }
    }

    // Split the transcript into paragraphs for better readability
    const paragraphs = transcriptText.split('\n\n').filter(p => p.trim().length > 0);
    
    if (paragraphs.length > 0) {
      for (const paragraph of paragraphs) {
        // Add each paragraph as a separate text block
        yPosition += addNormalText(paragraph, yPosition);
        yPosition += 5; // Add some space between paragraphs
        
        // Check if we need a new page
        if (yPosition > pdfHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
      }
    } else {
      yPosition += addNormalText(transcriptText, yPosition);
    }
    
    yPosition += 10;

    // Footer
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(128, 128, 128);
    
    // Ensure we have enough space for the footer
    if (yPosition > pdfHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }
    
    // Add footer text
    try {
      pdf.text(
        "Generated by Shankh Voice Assessment Platform",
        margin,
        pdfHeight - 20
      );
      
      // Format the date safely
      let reportDate;
      try {
        reportDate = new Date().toLocaleDateString();
      } catch (e) {
        console.error("Error formatting date:", e);
        reportDate = new Date().toISOString().split('T')[0]; // Fallback to YYYY-MM-DD format
      }
      
      pdf.text(
        `Report generated on ${reportDate}`,
        margin,
        pdfHeight - 10
      );
      
      // Generate a safe filename
      let userName = "user";
      try {
        if (userDetails?.userName) {
          // Remove any characters that might be invalid in filenames
          userName = String(userDetails.userName).replace(/[^\w\s-]/g, '').trim() || "user";
        }
      } catch (e) {
        console.error("Error processing username:", e);
      }
      
      let testDate = "";
      try {
        if (selectedTest?.date) {
          // If it's a date object, format it, otherwise use as is
          const dateObj = new Date(selectedTest.date);
          testDate = isNaN(dateObj.getTime()) 
            ? String(selectedTest.date).replace(/[^\w\s-]/g, '').trim() 
            : dateObj.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error("Error processing test date:", e);
      }
      
      const fileName = `shankh-assessment-${userName}${testDate ? '-' + testDate : ''}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
    } catch (e) {
      console.error("Error generating PDF footer:", e);
      // Fallback to a simple save if there was an error with the footer
      try {
        pdf.save("shankh-assessment-report.pdf");
      } catch (saveError) {
        console.error("Failed to save PDF:", saveError);
      }
    }
  };

  return (
    <div className="pl-4 sm:pl-[20px] space-y-4 h-[88svh] overflow-y-scroll w-full bg-[#F8FAFA] pr-4 sm:pr-[20px] pt-[32px] pb-[20px]">
      <div ref={page1Ref} className="flex flex-col space-y-4">
        <div className="bg-white space-y-2 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="leading-8">
              <h1
                style={{ fontFamily: "Poppins" }}
                className="text-2xl sm:text-[32px] font-semibold"
              >
                Assessment Result
              </h1>
              <SafeRender>
                <span
                  style={{ fontFamily: "Inter" }}
                  className="text-[14px] text-[#5F6C7B]"
                >
                  Test ID: {safeRender(selectedTest._id, 'N/A')} | {safeRender(selectedTest.date, 'No date')}
                </span>
              </SafeRender>
            </div>
            <button
              onClick={handleDownload}
              style={{ fontFamily: "Poppins" }}
              className="flex space-x-2 pb-[10px] rounded-lg pl-[16px] pt-[10px] pr-[16px] bg-[#34856C] text-white "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download-icon lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Download Report</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table
              style={{ fontFamily: "Inter" }}
              className="w-full text-[14px] min-w-[600px]"
            >
              <thead>
                <tr className=" text-[#5F6C7B] w-full  ">
                  <th className=" text-start font-medium">Full Name</th>
                  <th className=" text-start font-medium">Organization</th>
                  <th className=" text-start font-medium">Age & Gender</th>
                  <th className=" text-start font-medium">Location</th>
                  <th className=" text-start font-medium">Language</th>
                  <th className=" text-start font-medium">Occupation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="pt-2 border-gray-300 text-center w-full">
                  <td className="text-start">
                    <SafeRender>{() => safeRender(userDetails?.userName, '-')}</SafeRender>
                  </td>
                  <td className="text-start">
                    <SafeRender>{() => safeRender(userDetails?.orgName, '-')}</SafeRender>
                  </td>
                  <td className="text-start">
                    <SafeRender>{() => safeRender(userDetails?.age, '-')}</SafeRender>
                  </td>
                  <td className="text-start">
                    <SafeRender>{() => safeRender(userDetails?.location, '-')}</SafeRender>
                  </td>
                  <td className="text-start">
                    <SafeRender>{() => safeRender(selectedTest?.language, '-')}</SafeRender>
                  </td>
                  <td className="text-start">
                    <SafeRender>{() => safeRender(userDetails?.occupation, '-')}</SafeRender>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white space-y-8 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up-icon lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span
                style={{ fontFamily: "Poppins" }}
                className="text-xl sm:text-[24px] font-semibold"
              >
                Overall Result
              </span>
            </div>
            <span
              style={{ fontFamily: "Poppins" }}
              className="text-xl sm:text-[24px] font-semibold"
            >
              Shankh Score:{" "}
              <SafeRender>
                <span className="text-[#F9A826]">
                  {safeRender(Math.ceil(selectedTest?.overallScore), '0')}%
                </span>
              </SafeRender>
            </span>
          </div>
          <div className="relative">
            <SafeRender>
              {() => {
                const score = safeToNumber(selectedTest?.overallScore, 0);
                return (
                  <>
                    <svg
                      className="absolute top-[-25px] transform -translate-x-1/2"
                      style={{ left: `${Math.min(Math.max(score, 0), 100)}%` }}
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="12,16 4,8 20,8" />
                    </svg>
                    <div className="h-[31px] flex">
                      <div className="w-[39%] rounded-l-lg h-[31px] bg-[#FF6B5B]"></div>
                      <div className="w-[30%] h-[31px] bg-[#F9A826]"></div>
                      <div className="w-[31%] rounded-r-lg h-[31px] bg-[#34856C]"></div>
                    </div>
                  </>
                );
              }}
            </SafeRender>
            <div
              style={{ fontFamily: "Inter" }}
              className="justify-between text-[14px] text-[#5F6C7B] flex"
            >
              <span>Novice</span>
              <span>Emerging</span>
              <span>Proficient</span>
            </div>
          </div>
          <div
            style={{ fontFamily: "Poppins" }}
            className="items-center text-center text-[14px] p-[5px] justify-center flex flex-wrap gap-4 sm:gap-[140px]"
          >
            <div className="flex space-x-2 items-center">
              <div className="w-[15px] bg-[#FF6B5B] h-[13px]"></div>
              <span>Novice(0-39%)</span>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="w-[15px] bg-[#F9A826] h-[13px]"></div>
              <span>Emerging(40-69%)</span>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="w-[15px] bg-[#34856C] h-[13px]"></div>
              <span>Proficient(70-100%)</span>
            </div>
          </div>
        </div>
        <div className="bg-white space-y-2 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]">
          <h1
            style={{ fontFamily: "Poppins" }}
            className="text-xl sm:text-[24px] font-semibold"
          >
            Performance across Key Parameters
          </h1>
          <div
            style={{ fontFamily: "Inter" }}
            className="flex flex-col lg:flex-row gap-4 text-[18px]"
          >
            <div className="shadow-lg rounded-lg p-[20px] w-full lg:w-1/2">
              <h3 className="font-semibold">
                Voice Insights :
                <span className="font-medium">
                  {" "}
                  The Mechanics of Impactful Speech
                </span>
              </h3>
              <SpiderChart testData={selectedTest.voiceInsights} />
            </div>
            <div className="shadow-lg rounded-lg p-[20px] w-full lg:w-1/2">
              <h3 className="font-semibold">
                Behavior Insights :
                <span className="font-medium">
                  {" "}
                  The Psychology of your voice
                </span>
              </h3>
              <SpiderChart testData={selectedTest.behaviorInsights} />
            </div>
          </div>
        </div>
        <div
          style={{ fontFamily: "Poppins" }}
          className="bg-white brightness-100 space-y-8 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]"
        >
          <h1 className="text-xl sm:text-[24px] font-semibold">
            Detailed Voice Insights
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Fluency
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.voiceInsights.fluency <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.voiceInsights.fluency <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.voiceInsights.fluency <= 39
                    ? "Novice"
                    : selectedTest.voiceInsights.fluency <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.voiceInsights.fluency)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{ width: `${selectedTest.voiceInsights.fluency}%` }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.voiceInsights.fluency <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.voiceInsights.fluency <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Clarity
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    (Number(selectedTest.voiceInsights.clarity) || 0) <= 39
                      ? "text-[#FF6B5B]"
                      : (Number(selectedTest.voiceInsights.clarity) || 0) <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {(Number(selectedTest.voiceInsights.clarity) || 0) <= 39
                    ? "Novice"
                    : (Number(selectedTest.voiceInsights.clarity) || 0) <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(Number(selectedTest.voiceInsights.clarity) || 0)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${Math.min(
                        Number(selectedTest.voiceInsights.clarity) || 0,
                        100
                      )}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      (Number(selectedTest.voiceInsights.clarity) || 0) <= 39
                        ? "bg-[#FF6B5B]"
                        : (Number(selectedTest.voiceInsights.clarity) || 0) <=
                          69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Tone Modulation
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.voiceInsights.toneModulation <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.voiceInsights.toneModulation <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.voiceInsights.toneModulation <= 39
                    ? "Novice"
                    : selectedTest.voiceInsights.toneModulation <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.voiceInsights.toneModulation)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.voiceInsights.toneModulation}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.voiceInsights.toneModulation <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.voiceInsights.toneModulation <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Filler Words
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.voiceInsights.fillerWords <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.voiceInsights.fillerWords <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.voiceInsights.fillerWords <= 39
                    ? "Novice"
                    : selectedTest.voiceInsights.fillerWords <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.voiceInsights.fillerWords)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.voiceInsights.fillerWords}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.voiceInsights.fillerWords <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.voiceInsights.fillerWords <= 69
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
          className="bg-white brightness-100 space-y-8 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]"
        >
          <h1 className="text-xl sm:text-[24px] font-semibold">
            Detailed Behavior Insights
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Emotional Regulation
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.behaviorInsights.emotionalRegulation <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.behaviorInsights.emotionalRegulation <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.behaviorInsights.emotionalRegulation <= 39
                    ? "Novice"
                    : selectedTest.behaviorInsights.emotionalRegulation <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.behaviorInsights.emotionalRegulation)}
                  %
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.behaviorInsights.emotionalRegulation}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.behaviorInsights.emotionalRegulation <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.behaviorInsights.emotionalRegulation <=
                          69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Confidence & Presence
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.behaviorInsights.confidenceAndPresence <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.behaviorInsights.confidenceAndPresence <=
                        69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.behaviorInsights.confidenceAndPresence <= 39
                    ? "Novice"
                    : selectedTest.behaviorInsights.confidenceAndPresence <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(
                    selectedTest.behaviorInsights.confidenceAndPresence
                  )}
                  %
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.behaviorInsights.confidenceAndPresence}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.behaviorInsights.confidenceAndPresence <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.behaviorInsights.confidenceAndPresence <=
                          69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Pacing & Pauses
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.behaviorInsights.pacingAndPauses <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.behaviorInsights.pacingAndPauses <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.behaviorInsights.pacingAndPauses <= 39
                    ? "Novice"
                    : selectedTest.behaviorInsights.pacingAndPauses <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.behaviorInsights.pacingAndPauses)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.behaviorInsights.pacingAndPauses}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.behaviorInsights.pacingAndPauses <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.behaviorInsights.pacingAndPauses <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-lg pr-[25px] pb-[10px] pl-[25px] pt-[10px] ">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5F6C7B] text-[16px]">
                    Engagement
                  </span>
                  <span className="items-top text-center text-white rounded-full bg-[#5F6C7B] w-[12px] text-[10px] h-[12px]">
                    i
                  </span>
                </div>
                <span
                  className={`text-[16px] font-semibold ${
                    selectedTest.behaviorInsights.engagement <= 39
                      ? "text-[#FF6B5B]"
                      : selectedTest.behaviorInsights.engagement <= 69
                      ? "text-[#F9A826]"
                      : "text-[#34856C]"
                  }`}
                >
                  {selectedTest.behaviorInsights.engagement <= 39
                    ? "Novice"
                    : selectedTest.behaviorInsights.engagement <= 69
                    ? "Emerging"
                    : "Proficient"}
                </span>
              </div>
              <div>
                <span className="text-[24px] font-semibold">
                  {Math.ceil(selectedTest.behaviorInsights.engagement)}%
                </span>
                <div className="flex h-[10px] w-full rounded-l-full rounded-r-full bg-[#D9E0E6]">
                  <div
                    style={{
                      width: `${selectedTest.behaviorInsights.engagement}%`,
                    }}
                    className={`h-[10px] rounded-l-full rounded-r-full ${
                      selectedTest.behaviorInsights.engagement <= 39
                        ? "bg-[#FF6B5B]"
                        : selectedTest.behaviorInsights.engagement <= 69
                        ? "bg-[#F9A826]"
                        : "bg-[#34856C]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={page2Ref} className="flex flex-col space-y-4">
        <div className="bg-white brightness-100 space-y-8 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]">
          <div>
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-xl sm:text-[24px] font-semibold"
            >
              Filler Word Analysis
            </h1>
          </div>
          <p
            style={{ fontFamily: "Inter" }}
            className="text-center text-[14px]"
          >
            The usage of filler words is on the higher side, contributed
            primarily by "um", "like", "uh", and "you know". Training with
            impromptu speaking drills and using deliberate pauses instead of
            fillers can significantly improve your delivery.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.keys(selectedTest.fillerWordsUsed).map((key) => {
              console.log(selectedTest.fillerWordsUsed[key]);
              return (
                <div
                  className="flex rounded-2xl w-[135px] h-[114px] bg-white drop-shadow-lg pl-[16px] pb-[10px] pr-[16px] pt-[10px] shadow-xl flex-col items-center"
                  key={key}
                >
                  <span
                    style={{ fontFamily: "Poppins" }}
                    className="text-[#FF6B5B] font-semibold text-[32px]"
                  >
                    {selectedTest.fillerWordsUsed[key]}
                  </span>
                  <span style={{ fontFamily: "Inter" }} className="text-[18px]">
                    "{key}"
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{ fontFamily: "Poppins" }}
            className="flex gap-4 sm:gap-12 text-center justify-center items-center bg-[#FFFBF5] pr-4 sm:pr-[80px] pb-[19px] pl-4 sm:pl-[80px] pt-[19px] flex-wrap"
          >
            {selectedTest.voiceInsights.filler_words?.filler_counts ? (
              Object.entries(
                selectedTest.voiceInsights.filler_words.filler_counts
              ).map(([word, count], index) => {
                // Define colors to cycle through
                const colors = ["#34856C", "#F9A826", "#FF6B5B"];
                const color = colors[index % colors.length];

                return (
                  <div
                    key={word}
                    className="text-[20px] bg-white p-2 font-semibold rounded-xl drop-shadow-lg flex flex-col items-center"
                    style={{ color }}
                  >
                    <span>{word}</span>
                    <span className="text-sm text-gray-500">x{count}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No filler words detected</p>
            )}
          </div>
        </div>
        <div className="bg-white brightness-100 space-y-8 rounded-lg shadow-lg w-full pl-[24px] pt-[16px] pr-[24px] pb-[16px]">
          <div>
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-xl sm:text-[24px] font-semibold"
            >
              Transcript
            </h1>
          </div>
          <p
            style={{ fontFamily: "Inter" }}
            className="text-[16px] text-[#5F6C7B]"
          >
            {selectedTest.transcript}
          </p>
        </div>
      </div>
    </div>
  );
};

const Results = () => (
  <ErrorBoundary>
    <ResultsContent />
  </ErrorBoundary>
);

export default Results;
