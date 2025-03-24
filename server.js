import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import multer from "multer"; // ✅ Import multer for handling form data
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
app.use(express.urlencoded({ extended: true })); // Allow URL-encoded data

// ✅ Multer Setup (for handling form-data)
const upload = multer();
app.use(upload.none()); // This allows Express to process FormData without files

// ✅ CORS (Fixes frontend issues)
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-updated-xi.vercel.app", // ✅ Add Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true, // ✅ Required for cookies/auth tokens
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
    successRedirect: "https://frontend-updated-xi.vercel.app/dashboard", // ✅ Redirect to frontend
    failureRedirect: "https://frontend-updated-xi.vercel.app/login", // ✅ Redirect if login fails
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
const PORT = process.env.PORT || 5010; // ✅ Use Railway's assigned port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
