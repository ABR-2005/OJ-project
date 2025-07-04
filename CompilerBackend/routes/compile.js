const express = require("express");
const router = express.Router(); // ❗️ You missed the parentheses here
const { compileCode } = require("../compilers");

router.post("/", (req, res) => {
  const { code, input, language, timeLimit } = req.body;

  compileCode(language, code, input, timeLimit, (result) => {
    if (result.error) return res.status(400).json(result);
    res.json(result);
  });
});

module.exports = router;
