import mongoose from "mongoose";

// ✅ Contribution Schema
const contributionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Comment Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Story Schema
const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    content: { type: String, required: true, minlength: 10 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributions: [contributionSchema], // ✅ Contribution feature
    votes: { type: Number, default: 0 }, // ✅ Voting feature
    comments: [commentSchema], // ✅ Commenting feature
    history: [
      {
        title: String,
        content: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ], // ✅ Version control
  },
  { timestamps: true }
);

// ✅ Middleware: Track story history on updates
storySchema.pre("save", function (next) {
  if (this.isModified("title") || this.isModified("content")) {
    this.history.push({
      title: this.title,
      content: this.content,
      updatedAt: new Date(),
    });
  }
  next();
});

const Story = mongoose.model("Story", storySchema);
export default Story;
