const express =require("express");
const router = express.Router();
const { submitCode,getUserSubmissions }=require("../controllers/submissionController");

// POST api/submit will run the controller
router.post("/submit",submitCode);
router.get('/:userId', getUserSubmissions);

module.exports =router;