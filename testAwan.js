import fetch from "node-fetch"; // Ensure this is imported
import dotenv from "dotenv";
dotenv.config();

const testAwanGenre = async () => {
  try {
    console.log("🟢 Sending AI Genre Test Request...");

    const response = await fetch("https://api.awanllm.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AWAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "Meta-Llama-3-8B-Instruct",
        prompt: "Suggest a creative story idea for a fantasy genre.",
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("✅ Full AI Response:", data);
  } catch (error) {
    console.error("❌ AI Genre Test Failed:", error);
  }
};

testAwanGenre();
