import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // URL to profile picture
      default: "https://example.com/default-profile.jpg",
    },
    bio: {
      type: String,
      default: "Hello! I'm a storyteller.",
    },
    contributions: {
      type: Number,
      default: 0, // Increases when a user contributes to a story
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
