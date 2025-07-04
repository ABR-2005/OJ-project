const {OpenAI}=require("openai");
const openai = new OpenAI({ apikey: process.env.OPENAI_API_KEY});

exports.reviewCode =async (req,res) =>{
    const {code,language}= req.body;
    const prompt = 'Review this ${language} code:\n\n${code}';
    try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ review: chat.choices[0].message.content });
   } catch (err) {
    res.status(500).json({ error: "AI review failed", details: err.message });
   }
};