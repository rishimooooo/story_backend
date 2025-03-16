import dotenv from "dotenv";
import generateToken from "./utils/generateToken.js";

dotenv.config();

const user = {
  _id: "67cb4a70cbc7c6cedbb8e89a", // Replace with actual user ID
  name: "Alice Wonderland",
  email: "alice@example.com",
};

const token = generateToken(user);
console.log("Generated Token:", token);
