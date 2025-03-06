import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // ✅ Import MongoDB connection
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import storyRoutes from "./routes/storyRoutes.js"; // ✅ Import story routes

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// ✅ Use Routes
app.use("/api/users", userRoutes); // Now login/register work
app.use("/api/stories", storyRoutes);

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
