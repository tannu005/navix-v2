import Groq from "groq-sdk";

// Initialize the client with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure this is set in your Vercel environment variables
});

// Example: run a simple query
export async function generateContent(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Updated to a currently supported powerful Groq model
      messages: [
        { role: "system", content: "You are Navix AI Career Coach." },
        { role: "user", content: prompt },
      ],
    });

    // Return the text output
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq query failed:", error);
    throw error;
  }
}
