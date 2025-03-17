import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js"; // ✅ Import Passport.js
import connectDB from "./config/db.js"; // ✅ Import MongoDB connection
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import storyRoutes from "./routes/storyRoutes.js"; // ✅ Import story routes
import aiRoute from "./routes/aiRoutes.js"; // ✅ Import AI suggestion route
import MongoStore from "connect-mongo"; // ✅ Use MongoDB for session storage

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (Fixes frontend issues)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Change to deployed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true, // If using cookies/auth tokens
  })
);

// ✅ Session middleware for Passport (Uses MongoDB Store)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // ⚠️ Use a strong secret in .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // ✅ Use MongoDB for storing sessions
      collectionName: "sessions",
    }),
    cookie: { secure: false, httpOnly: true }, // Set secure: true if using HTTPS
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/ai-suggestions", aiRoute);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

// ✅ Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL + "/dashboard", // ✅ Redirect to frontend
    failureRedirect: process.env.FRONTEND_URL + "/login", // ✅ Redirect if login fails
  })
);

// ✅ Logout Route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080; // ✅ Use Railway's assigned port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
