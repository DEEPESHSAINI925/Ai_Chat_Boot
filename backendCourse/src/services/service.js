const   {GoogleGenAI} =require( "@google/genai" );
const { model } = require("mongoose");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Function to get caption from a base64 image
const getImageCaption=async (base64ImageFile)=> {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config:{
      systemInstruction: "You are a helpful assistant that generates captions for images.",
    }
  });
  return response.text;
}

const generateText = async (chatHistory) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    })
    console.log(response.text);
    return response.text
 } catch (error) {
    console.error("⚠️ Error in generateText:", error);
    throw error;
  }
};
module.exports={getImageCaption,generateText};
