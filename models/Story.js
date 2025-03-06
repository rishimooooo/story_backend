import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // 🔹 Store User ID
      ref: "User", // 🔹 Reference the User model
      required: true,
    },
  },
  { timestamps: true } // 🔹 Automatically adds createdAt & updatedAt
);

const Story = mongoose.model("Story", storySchema);
export default Story;
