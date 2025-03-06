import express from "express";
import Story from "../models/Story.js"; // Import Story Model
import { protect } from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// ✅ Update Story API
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Ensure the logged-in user is the author
    if (story.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this story" });
    }

    // Update story fields
    story.title = title || story.title;
    story.content = content || story.content;

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
  }
});

export default router;
