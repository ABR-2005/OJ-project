const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.reviewCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-pro", // or another Gemini model if preferred
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpful AI code reviewer. Review the following code for bugs, best practices, and optimizations.\n\n${code}`,
            },
          ],
        },
      ],
      // You can add config here if needed
    });

    const review = response.candidates?.[0]?.content?.parts?.[0]?.text || "No review generated.";
    res.json({ review });
  } catch (err) {
    console.error("Gemini review failed:", err);
    res.status(500).json({ error: "Error while getting AI review. Please try again." });
  }
};
