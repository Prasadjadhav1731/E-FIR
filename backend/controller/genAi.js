const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateContent = async (req, res) => {
  try {
    const apiKey = process.env.API_KEY_GEN_AI;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = req.body.prompt ? req.body.prompt.trim() : "";

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("Error generating AI content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI content",
      fallbackText: "AI summary generation currently unavailable",
    });
  }
};
