import bcrypt from "bcryptjs";

const testPassword = "test1234"; // Change this if needed

const hashPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testPassword, salt);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();
