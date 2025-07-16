const express =require("express");
const router = express.Router();
const { submitCode,getUserSubmissions }=require("../controllers/submissionController");
const axios = require("axios");

// POST api/submit will run the controller
router.post("/submit",submitCode);
router.get('/:userId', getUserSubmissions);

// Custom compilation route
router.post("/compile", async (req, res) => {
  try {
    const { code, input, language, timeLimit } = req.body;
    const response = await axios.post("http://compilerbackend:5001/compile", {
      code,
      input,
      language,
      timeLimit
    });
    res.json(response.data);
  } catch (err) {
    console.error("Custom compilation error:", err?.response?.data || err.message);
    res.status(500).json({ error: err?.response?.data?.error || "Compilation error" });
  }
});

module.exports =router;