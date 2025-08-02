exports.reviewCode = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }
  
  const lines = code.split("\n").length;
  const hasMain = code.includes("main(");
  const hasReturn = code.includes("return");
  
  let review = " **AI Code Review**\n\n";
  review += `📊 **Code Statistics:**\n`;
  review += `• Lines of code: ${lines}\n`;
  review += `• Language: C/C++\n\n`;
  
  review += `✅ **Positive Observations:**\n`;
  if (hasMain) review += `• Has main function ✓\n`;
  if (hasReturn) review += `• Has return statement ✓\n`;
  if (lines < 50) review += `• Code is concise ✓\n`;
  
  review += `\n **Suggestions:**\n`;
  if (!hasMain) review += `• Consider adding a main function\n`;
  if (!hasReturn) review += `• Add return statement\n`;
  
  review += `\n🎯 **Overall:** Good code! Keep practicing.`;
  
  return res.json({ review });
};
