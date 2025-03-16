import bcrypt from "bcryptjs";

const plainPassword = "Test@123"; // Try the password you entered
const hashedPassword =
  "$2b$10$gxIoXa9uLYsu9FxgC0JPnOYjdPO14EEfMUnS.x23jGu9VGLZ6ZbZ"; // Copy from MongoDB

async function testPassword() {
  console.log("🔄 Testing bcrypt comparison...");
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("✅ Password Match Result:", isMatch);
}

testPassword();
