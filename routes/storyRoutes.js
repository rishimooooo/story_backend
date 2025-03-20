import express from "express";
import mongoose from "mongoose";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/** ✅ Create a New Story (Protected) */
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const story = new Story({ title, content, author: req.user._id });
    const savedStory = await story.save();

    res.status(201).json(savedStory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating story", error: error.message });
  }
});

/** ✅ Get All Stories with Optional Search & Sorting */
router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;
    let filter = {};

    if (search?.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    let query = Story.find(filter).populate("author", "name profilePicture");

    if (sort === "latest") query = query.sort({ createdAt: -1 });
    else if (sort === "oldest") query = query.sort({ createdAt: 1 });
    else if (sort === "top") query = query.sort({ votes: -1 });

    const stories = await query.lean();
    res.json(stories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
});

/** ✅ Get a Single Story by ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }
    const story = await Story.findById(id).populate(
      "author",
      "name profilePicture"
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching story", error: error.message });
  }
});

/** ✅ Update a Story (Protected) */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }
    if (!title && !content) {
      return res
        .status(400)
        .json({ message: "Title or content required for update" });
    }
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this story" });
    }
    story.title = title || story.title;
    story.content = content || story.content;
    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
  }
});

/** ✅ Delete a Story (Protected) */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    await story.deleteOne();
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting story", error: error.message });
  }
});

/** ✅ Leaderboard API */
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Story.aggregate([
      { $unwind: "$contributions" },
      {
        $group: {
          _id: "$contributions.user",
          contributions: { $sum: 1 },
        },
      },
      { $sort: { contributions: -1 } },
      { $limit: 10 },
    ]);

    const populatedLeaderboard = await User.populate(leaderboard, {
      path: "_id",
      select: "name profilePicture",
    });

    res.json(
      populatedLeaderboard.map((entry) => ({
        userId: entry._id._id,
        name: entry._id.name,
        profilePicture: entry._id.profilePicture,
        contributions: entry.contributions,
      }))
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: error.message });
  }
});

export default router;
