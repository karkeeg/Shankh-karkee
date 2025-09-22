import React, { useEffect, useState, useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

const SpiderChart = ({ testData = {} }) => {
  // Process data with useMemo to prevent unnecessary recalculations
  const processedData = useMemo(() => {
    if (!testData || Object.keys(testData).length === 0) {
      return [];
    }
    
    return Object.entries(testData)
      .filter(([_, value]) => typeof value === 'number' && !isNaN(value))
      .map(([key, value]) => ({
        subject: key,
        value: Math.max(0, Math.min(100, Number(value))) // Ensure value is between 0-100
      }));
  }, [testData]);

  // Don't render the chart if no valid data
  if (processedData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
        <div className="text-gray-500 text-sm">No data available for the radar chart</div>
      </div>
    );
  }

  // Determine stroke and fill colors based on data
  const getChartColor = () => {
    const hasFluency = 'fluency' in testData && testData.fluency !== undefined;
    return hasFluency ? "#F9A826" : "#FF6B5B";
  };

  const chartColor = getChartColor();

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="70%" 
          data={processedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid radialLines={false} gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tick={({ payload, x, y, textAnchor, coordinate }) => {
              if (!payload || !payload.value) return null;
              
              const angle = coordinate?.angle || 0;
              let adjustedX = x || 0;
              let adjustedY = y || 0;
              let anchor = textAnchor || "middle";
              const offset = 20;

              // Adjust position based on angle to prevent cutoff
              if (angle >= 45 && angle <= 135) {
                adjustedY = y - offset;
                anchor = "middle";
              } else if (angle > 135 && angle <= 225) {
                adjustedX = x - offset;
                anchor = "end";
                if (payload.value.toString().length > 8) {
                  adjustedX = x - (offset + 10);
                }
              } else if (angle > 225 && angle <= 315) {
                adjustedY = y + offset;
                anchor = "middle";
              } else {
                adjustedX = x + offset;
                anchor = "start";
                if (payload.value.toString().length > 8) {
                  adjustedX = x + (offset + 10);
                }
              }

              return (
                <text
                  x={adjustedX}
                  y={adjustedY}
                  textAnchor={anchor}
                  fill="black"
                  style={{ fontSize: "10px", fontWeight: 500 }}
                  className="text-xs sm:text-sm"
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            ticks={[0, 39, 69, 100]}
            tick={({ payload, y }) => {
              if (!payload || payload.value === undefined) return null;
              
              let label = "";
              let fill = "#666";
              
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
            name="Performance"
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={0.3}
            dot={{
              stroke: chartColor,
              strokeWidth: 2,
              fill: '#fff',
              r: 3
            }}
            activeDot={{
              stroke: '#fff',
              strokeWidth: 3,
              r: 5
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpiderChart;
