const router = require("express").Router();
const { Test } = require("../models/test");
require("dotenv").config();

// Converts BSON/Extended JSON recursively to plain JS values
const transformValue = (value) => {
  if (value === null || typeof value !== "object") return value;

  // Handle Decimal128 instance (when not stringified)
  if (
    value &&
    value._bsontype === "Decimal128" &&
    typeof value.toString === "function"
  ) {
    return parseFloat(value.toString());
  }

  // Extended JSON number types
  if ("$numberDecimal" in value) return parseFloat(value.$numberDecimal);
  if ("$numberDouble" in value) return parseFloat(value.$numberDouble);
  if ("$numberInt" in value) return parseInt(value.$numberInt, 10);
  if ("$numberLong" in value) return parseInt(value.$numberLong, 10);

  // Extended JSON ObjectId / Date
  if ("$oid" in value) return value.$oid;
  if ("$date" in value) return new Date(value.$date);

  if (Array.isArray(value)) return value.map(transformValue);

  const out = {};
  for (const k in value) {
    if (Object.prototype.hasOwnProperty.call(value, k)) {
      out[k] = transformValue(value[k]);
    }
  }
  return out;
};

const ensureNumber = (obj, prop) => {
  if (!obj || obj[prop] === undefined || obj[prop] === null) return;
  const n = Number(obj[prop]);
  obj[prop] = Number.isFinite(n) ? n : 0;
};

const transformTestData = (test) => {
  // Work on the lean object directly; recursively normalize values:
  const transformed = transformValue(test);

  // Normalize nested scores if present
  if (transformed.voiceInsights) {
    for (const k of Object.keys(transformed.voiceInsights)) {
      ensureNumber(transformed.voiceInsights, k);
    }
  }
  if (transformed.behaviorInsights) {
    for (const k of Object.keys(transformed.behaviorInsights)) {
      ensureNumber(transformed.behaviorInsights, k);
    }
  }

  ensureNumber(transformed, "overallScore");
  ensureNumber(transformed, "fillerWordsUsed");

  // Keep objects present even if missing
  transformed.voiceInsights = transformed.voiceInsights || {};
  transformed.behaviorInsights = transformed.behaviorInsights || {};

  return transformed;
};

module.exports = router.get("/", async (req, res) => {
  try {
    // getters: true lets mongoose apply getters (often helpful for decimals)
    let data = await Test.find({}).lean({ getters: true });

    if (!data || data.length === 0) {
      return res.status(409).send({ message: "No tests found" });
    }

    const transformedData = data.map(transformTestData);

    console.log("Transformed Data:", transformedData);
    res
      .status(200)
      .send({ data: transformedData, message: "Test data found!" });
  } catch (error) {
    console.error("Error in getAllTests:", error);
    res.status(500).send({ message: "Internal Server error." });
  }
});
