import fetch from "node-fetch";
import { AWAN_API_URL, AWAN_API_KEY } from "../config/config.js";

/** 🔹 Generate AI Suggestions for a Story with Genre */
export const generateAISuggestion = async (storyText, genre = "General") => {
  try {
    if (!AWAN_API_KEY) {
      console.error(
        "❌ Missing AI API Key! Ensure AWAN_API_KEY is set in .env"
      );
      return "AI suggestion service unavailable.";
    }

    console.log(`🟢 Requesting AI Suggestion for Genre: ${genre}`);

    const prompt = `Continue this story in the style of a ${genre} novel:
    
    Story so far: "${storyText}"
    
    Guidelines:
    - Maintain a ${genre.toLowerCase()} tone and atmosphere.
    - Expand with rich descriptions and vivid details.
    - Develop character emotions and realistic interactions.
    - Introduce an engaging plot twist or unexpected event.
    - Keep the writing style natural and immersive.`;

    const response = await fetch(AWAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AWAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "Meta-Llama-3-8B-Instruct",
        prompt,
        max_tokens: 250,
        temperature: 0.85,
      }),
    });

    const data = await response.json();

    if (data.choices?.length > 0) {
      console.log("✅ AI Suggestion Generated Successfully");
      return data.choices[0].text.trim();
    } else {
      console.error("❌ AI Response Error:", data);
      return "No AI suggestion available.";
    }
  } catch (error) {
    console.error("❌ AI Error:", error.message || error);
    return "AI suggestion failed.";
  }
};

/** 🔹 Generate AI Story Summary */
export const generateStorySummary = async (storyText) => {
  try {
    if (!AWAN_API_KEY) {
      console.error(
        "❌ Missing AI API Key! Ensure AWAN_API_KEY is set in .env"
      );
      return "AI summary service unavailable.";
    }

    console.log("🟢 Generating AI Story Summary...");

    const prompt = `Summarize this story in a concise and engaging way:
    
    Story: "${storyText}"`;

    const response = await fetch(AWAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AWAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "Meta-Llama-3-8B-Instruct",
        prompt,
        max_tokens: 100,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (data.choices?.length > 0) {
      console.log("✅ AI Summary Generated Successfully");
      return data.choices[0].text.trim();
    } else {
      console.error("❌ AI Response Error:", data);
      return "No summary available.";
    }
  } catch (error) {
    console.error("❌ AI Error:", error.message || error);
    return "AI summary failed.";
  }
};
