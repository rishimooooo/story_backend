import request from "supertest";
import app from "../server.js"; // Assuming server.js exports the Express app
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

describe("User Login API", () => {
  beforeAll(async () => {
    // Setup: Create a test user in the database
    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "Test@1234", // Ensure this is hashed in the actual implementation
    });
  });

  afterAll(async () => {
    // Cleanup: Remove the test user
    await User.deleteOne({ email: "testuser@example.com" });
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 404 for user not found", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 400 for invalid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "WrongPassword",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "",
      password: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Missing required fields");
  });
});
