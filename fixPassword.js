import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js"; // Adjust the path based on your project structure

const fixUserPassword = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const user = await User.findOne({ email: "doe@example.com" });
    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log("🔐 Old Stored Password:", user.password);

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash("Test@123", salt);
    user.password = newHashedPassword;

    await user.save();
    console.log("✅ Password updated successfully:", newHashedPassword);
  } catch (error) {
    console.error("❌ Error updating password:", error);
  } finally {
    mongoose.connection.close();
  }
};

fixUserPassword();
