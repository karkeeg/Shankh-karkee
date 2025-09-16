import React, { useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import SpiderChart from "../../SpiderChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Results = () => {
  const { userDetails, transcript, selectedTest } = useAppContext();

  console.log("fILLER value:", selectedTest.filler_words);
  if (selectedTest.voiceInsights) {
    console.log("Type of clarity:", typeof selectedTest.voiceInsights.clarity);
  }

  console;

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
        pdf.text(header, currentX + 2, startY + 6);
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
          pdf.text(cell, currentX + 2, rowY + 5);
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

    // Helper function to create a radar chart
    const createRadarChart = (
      data,
      centerX,
      centerY,
      radius,
      title,
      startY
    ) => {
      const angleStep = (2 * Math.PI) / Object.keys(data).length;
      const angles = Object.keys(data).map((_, index) => index * angleStep);
      const labels = Object.keys(data);
      const values = Object.values(data);

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
      const maxValue = Math.max(...Object.values(data));
      const barWidth = width / Object.keys(data).length;
      const barSpacing = 5;

      // Draw title
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(52, 133, 108);
      pdf.text(title, startX, startY);

      // Draw bars
      Object.entries(data).forEach(([label, value], index) => {
        const barHeight = (value / maxValue) * height;
        const x = startX + index * (barWidth + barSpacing);
        const y = startY + 15 + (height - barHeight);

        // Color based on value
        if (value <= 39) {
          pdf.setFillColor(255, 107, 91); // #FF6B5B
        } else if (value <= 69) {
          pdf.setFillColor(249, 168, 38); // #F9A826
        } else {
          pdf.setFillColor(52, 133, 108); // #34856C
        }

        pdf.rect(x, y, barWidth, barHeight, "F");

        // Draw value on bar
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text(
          `${Math.ceil(value)}%`,
          x + barWidth / 2 - 8,
          y + barHeight / 2 + 2
        );

        // Draw label
        pdf.setTextColor(0, 0, 0);
        pdf.text(label, x + barWidth / 2 - 8, startY + 15 + height + 5);
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
      ["Test ID", selectedTest._id],
      ["Date", selectedTest.date],
      ["Language", selectedTest.language || "Auto-detected"],
      ["Overall Score", `${Math.ceil(selectedTest.overallScore)}%`],
    ];
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
      ["Name", userDetails.userName],
      ["Organization", userDetails.orgName],
      ["Location", userDetails.location || "Not specified"],
      ["Occupation", userDetails.occupation || "Not specified"],
    ];
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

    const overallScore = Math.ceil(selectedTest.overallScore);
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

    const filledWidth = (overallScore / 100) * scoreBarWidth;
    pdf.rect(scoreBarX, scoreBarY, filledWidth, scoreBarHeight, "F");

    // Score text
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `${overallScore}%`,
      scoreBarX + scoreBarWidth + 10,
      scoreBarY + 10
    );
    pdf.text(
      `(${performanceLevel})`,
      scoreBarX + scoreBarWidth + 10,
      scoreBarY + 20
    );

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

    // Voice Insights Table
    yPosition = addSectionHeader("Voice Insights Summary", yPosition);
    yPosition += 5;

    const voiceHeaders = ["Parameter", "Score", "Level"];
    const voiceData = [
      [
        "Fluency",
        `${Math.ceil(selectedTest.voiceInsights.fluency)}%`,
        selectedTest.voiceInsights.fluency <= 39
          ? "Novice"
          : selectedTest.voiceInsights.fluency <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Tone Modulation",
        `${Math.ceil(selectedTest.voiceInsights.toneModulation)}%`,
        selectedTest.voiceInsights.toneModulation <= 39
          ? "Novice"
          : selectedTest.voiceInsights.toneModulation <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Clarity",
        `${Math.ceil(selectedTest.voiceInsights.clarity || 0)}%`,
        (selectedTest.voiceInsights.clarity || 0) <= 39
          ? "Novice"
          : (selectedTest.voiceInsights.clarity || 0) <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Filler Words",
        `${Math.ceil(selectedTest.voiceInsights.fillerWords)}%`,
        selectedTest.voiceInsights.fillerWords <= 39
          ? "Novice"
          : selectedTest.voiceInsights.fillerWords <= 69
          ? "Emerging"
          : "Proficient",
      ],
    ];
    const voiceWidths = [50, 30, 80];
    yPosition = createTable(voiceHeaders, voiceData, yPosition, voiceWidths);

    // Behavior Insights Table
    yPosition = addSectionHeader("Behavior Insights Summary", yPosition);
    yPosition += 5;

    const behaviorHeaders = ["Parameter", "Score", "Level"];
    const behaviorData = [
      [
        "Emotional Regulation",
        `${Math.ceil(selectedTest.behaviorInsights.emotionalRegulation)}%`,
        selectedTest.behaviorInsights.emotionalRegulation <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.emotionalRegulation <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Confidence & Presence",
        `${Math.ceil(selectedTest.behaviorInsights.confidenceAndPresence)}%`,
        selectedTest.behaviorInsights.confidenceAndPresence <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.confidenceAndPresence <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Pacing & Pauses",
        `${Math.ceil(selectedTest.behaviorInsights.pacingAndPauses)}%`,
        selectedTest.behaviorInsights.pacingAndPauses <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.pacingAndPauses <= 69
          ? "Emerging"
          : "Proficient",
      ],
      [
        "Engagement",
        `${Math.ceil(selectedTest.behaviorInsights.engagement)}%`,
        selectedTest.behaviorInsights.engagement <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.engagement <= 69
          ? "Emerging"
          : "Proficient",
      ],
    ];
    const behaviorWidths = [50, 30, 80];
    yPosition = createTable(
      behaviorHeaders,
      behaviorData,
      yPosition,
      behaviorWidths
    );

    // Filler Words Analysis
    yPosition = addSectionHeader("Filler Words Analysis", yPosition);
    yPosition += 5;

    const totalFillers = Object.values(selectedTest.fillerWordsUsed).reduce(
      (a, b) => a + b,
      0
    );
    yPosition += addNormalText(
      `Total Filler Words Used: ${totalFillers}`,
      yPosition
    );
    yPosition += 10;

    // Filler Words Bar Chart
    const sortedFillers = Object.entries(selectedTest.fillerWordsUsed)
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
    const analysisData = [
      [
        "Fluency",
        `${Math.ceil(selectedTest.voiceInsights.fluency)}%`,
        selectedTest.voiceInsights.fluency <= 39
          ? "Novice"
          : selectedTest.voiceInsights.fluency <= 69
          ? "Emerging"
          : "Proficient",
        "Smooth speech without interruptions or hesitations",
      ],
      [
        "Tone Modulation",
        `${Math.ceil(selectedTest.voiceInsights.toneModulation)}%`,
        selectedTest.voiceInsights.toneModulation <= 39
          ? "Novice"
          : selectedTest.voiceInsights.toneModulation <= 69
          ? "Emerging"
          : "Proficient",
        "Voice pitch, volume, and speed variation",
      ],
      [
        "Clarity",
        `${Math.ceil(selectedTest.voiceInsights.clarity || 0)}%`,
        (selectedTest.voiceInsights.clarity || 0) <= 39
          ? "Novice"
          : (selectedTest.voiceInsights.clarity || 0) <= 69
          ? "Emerging"
          : "Proficient",
        "Clear and distinct pronunciation",
      ],
      [
        "Filler Words",
        `${Math.ceil(selectedTest.voiceInsights.fillerWords)}%`,
        selectedTest.voiceInsights.fillerWords <= 39
          ? "Novice"
          : selectedTest.voiceInsights.fillerWords <= 69
          ? "Emerging"
          : "Proficient",
        "Minimal use of unnecessary words",
      ],
      [
        "Emotional Regulation",
        `${Math.ceil(selectedTest.behaviorInsights.emotionalRegulation)}%`,
        selectedTest.behaviorInsights.emotionalRegulation <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.emotionalRegulation <= 69
          ? "Emerging"
          : "Proficient",
        "Control and expression of emotions",
      ],
      [
        "Confidence & Presence",
        `${Math.ceil(selectedTest.behaviorInsights.confidenceAndPresence)}%`,
        selectedTest.behaviorInsights.confidenceAndPresence <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.confidenceAndPresence <= 69
          ? "Emerging"
          : "Proficient",
        "Self-assurance and attention command",
      ],
      [
        "Pacing & Pauses",
        `${Math.ceil(selectedTest.behaviorInsights.pacingAndPauses)}%`,
        selectedTest.behaviorInsights.pacingAndPauses <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.pacingAndPauses <= 69
          ? "Emerging"
          : "Proficient",
        "Timing, rhythm, and strategic pauses",
      ],
      [
        "Engagement",
        `${Math.ceil(selectedTest.behaviorInsights.engagement)}%`,
        selectedTest.behaviorInsights.engagement <= 39
          ? "Novice"
          : selectedTest.behaviorInsights.engagement <= 69
          ? "Emerging"
          : "Proficient",
        "Audience connection and interest maintenance",
      ],
    ];
    const analysisWidths = [40, 25, 25, 70];
    yPosition = createTable(
      analysisHeaders,
      analysisData,
      yPosition,
      analysisWidths
    );

    // Check if we need a new page
    if (yPosition > pdfHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Recommendations
    yPosition = addSectionHeader("Personalized Recommendations", yPosition);
    yPosition += 5;

    const recommendations = [];

    if (selectedTest.voiceInsights.fluency <= 39) {
      recommendations.push(
        "Practice speaking exercises to improve fluency and reduce hesitations"
      );
    }
    if (
      selectedTest.voiceInsights.clarity &&
      selectedTest.voiceInsights.clarity <= 39
    ) {
      recommendations.push(
        "Focus on clear pronunciation and articulation exercises"
      );
    }
    if (selectedTest.voiceInsights.fillerWords <= 39) {
      recommendations.push(
        "Work on reducing filler words through conscious practice and awareness"
      );
    }
    if (selectedTest.behaviorInsights.confidenceAndPresence <= 39) {
      recommendations.push(
        "Build confidence through regular practice and positive self-talk"
      );
    }
    if (selectedTest.behaviorInsights.engagement <= 39) {
      recommendations.push(
        "Practice audience engagement techniques and storytelling"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Continue practicing to maintain and further improve your excellent communication skills"
      );
    }

    const recHeaders = ["Priority", "Recommendation"];
    const recData = recommendations.map((rec, index) => [`${index + 1}`, rec]);
    const recWidths = [25, 135];
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

    yPosition += addNormalText(
      selectedTest.transcript || "No transcript available",
      yPosition
    );
    yPosition += 10;

    // Footer
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      "Generated by Shankh Voice Assessment Platform",
      margin,
      pdfHeight - 10
    );
    pdf.text(
      `Report generated on ${new Date().toLocaleDateString()}`,
      margin,
      pdfHeight - 5
    );

    // Save the PDF
    pdf.save(
      `shankh-assessment-${userDetails.userName}-${selectedTest.date}.pdf`
    );
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
              <span
                style={{ fontFamily: "Inter" }}
                className="text-[14px] text-[#5F6C7B]"
              >
                Test ID : {selectedTest._id} | {selectedTest.date}
              </span>
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
                <tr className="pt-2 border-gray-300 text-center  w-full ">
                  <td className="text-start ">{userDetails.userName}</td>
                  <td className="text-start ">{userDetails.orgName}</td>
                  <td className="text-start ">Age</td>
                  <td className="text-start ">{userDetails.location || "-"}</td>
                  <td className="text-start ">
                    {selectedTest.language || "-"}
                  </td>
                  <td className="text-start ">
                    {userDetails.occupation || "-"}
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
              Shankh Score :{" "}
              <span className="text-[#F9A826]">
                {Math.ceil(selectedTest.overallScore)}%
              </span>
            </span>
          </div>
          <div className="relative">
            <svg
              className="absolute  top-[-25px] transform -translate-x-1/2"
              style={{ left: `${selectedTest.overallScore}%` }}
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
              <div className="w-[31%] rounded-r-lg  h-[31px] bg-[#34856C]"></div>
            </div>
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

export default Results;
