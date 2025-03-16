import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    const response = await openai.models.retrieve("gpt-4");
    console.log("✅ You have access to GPT-4:", response);
  } catch (error) {
    console.error("❌ No access to GPT-4:", error.message);
  }
})();
