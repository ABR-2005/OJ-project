// C:\Users\ASUS\OneDrive\Desktop\ONLINE JUDGE\Backend\controllers\aiReviewController.js

const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google's library

// Access your API key as an environment variable (loaded by dotenv)
// Use the name you set in your .env file, e.g., GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// For Gemini Pro, which is suitable for text generation and understanding
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

exports.reviewCode = async (req, res) => {
    const { code, language } = req.body;
    // Construct a clear prompt for code review
    const prompt = `Please review the following ${language} code for correctness, efficiency, common errors, and suggest improvements. Provide your review in a structured format (e.g., bullet points, sections).\n\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); // Get the generated text content

        res.json({ review: text });
    } catch (err) {
        console.error("Gemini AI review failed:", err); // Log the error for debugging
        res.status(500).json({ error: "AI review failed", details: err.message });
    }
};