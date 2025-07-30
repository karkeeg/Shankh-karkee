import React, { useEffect, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

const SpiderChart = ({ testData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (testData) {
      setData(
        Object.entries(testData).map(([key, value]) => ({
          subject: key,
          value: value,
        }))
      );
    }
  }, [testData]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid radialLines={false} gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tick={({ payload, x, y, textAnchor, coordinate }) => {
              // Safely get angle with fallback
              const angle = coordinate?.angle || 0;
              let adjustedX = x || 0;
              let adjustedY = y || 0;
              let anchor = textAnchor || "middle";
              let fontSize = "8px";
              let offset = 20;

              // Adjust position based on angle to prevent cutoff
              if (angle >= 45 && angle <= 135) {
                // Top - move up and center
                adjustedY = y - offset;
                anchor = "middle";
              } else if (angle > 135 && angle <= 225) {
                // Left - move left and right-align
                adjustedX = x - offset;
                anchor = "end";
                // For longer labels on left, add more offset
                if (payload?.value && payload.value.length > 8) {
                  adjustedX = x - (offset + 10);
                }
              } else if (angle > 225 && angle <= 315) {
                // Bottom - move down and center
                adjustedY = y + offset;
                anchor = "middle";
              } else {
                // Right - move right and left-align
                adjustedX = x + offset;
                anchor = "start";
                // For longer labels on right, add more offset
                if (payload?.value && payload.value.length > 8) {
                  adjustedX = x + (offset + -50);
                }
              }

              return (
                <text
                  x={adjustedX}
                  y={adjustedY}
                  textAnchor={anchor}
                  fill="black"
                  style={{ fontSize: fontSize, fontWeight: "500" }}
                  className="text-xs sm:text-sm"
                >
                  {payload?.value || ""}
                </text>
              );
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            ticks={[0, 39, 69, 100]}
            tick={({ payload, x, y, textAnchor }) => {
              let label = "";
              let fill = "red";
              if (payload.value === 0) {
                label = "Emerging";
                fill = "#FF6B5B";
              } else if (payload.value === 39) {
                label = "Proficient";
                fill = "#F9A826";
              } else if (payload.value === 69) {
                label = "Masterful";
                fill = "#34856C";
              }

              return (
                <text
                  x="50%"
                  y={y}
                  textAnchor="middle"
                  fill={fill}
                  style={{ fontSize: "10px" }}
                  className="font-semibold"
                >
                  {label}
                </text>
              );
            }}
          />
          <Radar
            dataKey="value"
            stroke={testData.fluency ? "#F9A826" : "#FF6B5B"}
            fill={testData.fluency ? "#F9A826" : "#FF6B5B"}
            fillOpacity={0.3}
            dot={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpiderChart;
