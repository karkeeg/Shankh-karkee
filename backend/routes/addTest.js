const router = require("express").Router();
const { Test } = require("../models/test");

module.exports = router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId || !req.body.orgId) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Create a new test document with all provided fields
    const testData = {
      ...req.body,
      // Ensure we have a proper date if not provided
      date: req.body.date || new Date().toISOString(),
      // Set createdAt timestamp
      createdAt: new Date()
    };

    const test = new Test(testData);
    const savedTest = await test.save();

    console.log('Test saved successfully:', savedTest._id);

    return res.status(201).send({
      data: savedTest,
      message: "Test results saved successfully!"
    });
  } catch (error) {
    console.error("Error saving test results:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).send({
        message: "A test with this ID already exists"
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: "Validation error",
        details: error.message
      });
    }
    
    res.status(500).send({
      message: "Internal server error while saving test results"
    });
  }
});
