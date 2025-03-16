import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const generateToken = () => {
  const userId = "67cb4a70cbc7c6cedbb8e89a"; // Your user ID
  const secretKey = process.env.JWT_SECRET || "your_secret_key"; // Use .env secret or fallback

  return jwt.sign({ id: userId }, secretKey, { expiresIn: "30d" });
};

// Generate and print the token
const token = generateToken();
console.log("Generated JWT Token:", token);
