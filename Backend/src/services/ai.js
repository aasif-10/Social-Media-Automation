const GoogleGenAI = require("@google/genai");
const envConfig = require("../config/env-config");

module.exports.generatePostContent = async (prompt, tone, generateImage) => {
  try {
    const apiKey = envConfig.GOOGLE_API_KEY;

    const ai = new GoogleGenAI({ apiKey });
    const textContent = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a social media post with the following prompt: "${prompt}" and in the tone: "${tone}".
    Generate image only if the generateImage flag is set to true. If generateImage is false, do not generate an image.
    image generation prompt should be based on the content of the post and should be relevant to the post content.
    Generate image : ${generateImage ? "true" : "false"}.
    Return the output in JSON format with the following structure:
      {
        "content": "The generated post content goes here.",
        "imagePrompt": "The prompt for generating an image goes here."
      }`,
    });

    const data = JSON.parse(textContent.text);

    return data;
  } catch (error) {
    console.error("Error generating post content:", error);
    throw new Error("Failed to generate post content.");
  }
};
