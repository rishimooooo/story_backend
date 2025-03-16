import bcrypt from "bcryptjs";

const enteredPassword = "Test@1234"; // Replace with your real password
const storedHashedPassword =
  "$2b$10$RlDSeXzk.Ojz1tR5xOVhNOBipHEw4Nj85oIeGYsQN68UAiylNSAnK"; // Replace with the actual stored hash

const checkPassword = async () => {
  const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
  console.log("Password Match:", isMatch);
};

checkPassword();
