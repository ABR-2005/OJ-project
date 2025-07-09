const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.reviewCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: "You are a helpful AI code reviewer. Review the following code for bugs, best practices, and optimizations.",
        },
        {
          role: "user",
          content: code,
        },
      ],
      temperature: 0.7,
    });

    const review = response.choices[0].message.content;
    res.json({ review });
  } catch (err) {
    console.error("OpenAI review failed:", err);
    res.status(500).json({ error: "Error while getting AI review. Please try again." });
  }
};
