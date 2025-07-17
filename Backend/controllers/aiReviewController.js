const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Switch back to the model that is available for your API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Start a chat session with system prompt
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              { text: "You are a helpful AI code reviewer. Review the following code for bugs, best practices, and optimizations." }
            ]
          }
        ]
      });

      // Send the code for review
      const result = await chat.sendMessage(code);
      const review = result.response.text();

      return res.json({ review });
    } catch (err) {
      lastError = err;
      // Retry only on 503 Service Unavailable
      if (err.status === 503 && attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      } else {
        break;
      }
    }
  }

  // If we reach here, all attempts failed
  console.error("Gemini review failed after retries:", lastError);
  let userMessage = "Error while getting AI review. Please try again later.";
  if (lastError && lastError.status === 503) {
    userMessage = "AI review service is temporarily overloaded. Please try again in a few minutes.";
  }
  res.status(500).json({ error: userMessage });
};
