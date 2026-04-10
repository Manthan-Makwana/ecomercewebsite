/**
 * seedAdmin.js — Run once to create an admin user in MongoDB Atlas
 * Usage: node seedAdmin.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profile: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  resetpasswordtoken: String,
  resetpasswordexpire: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const ADMIN = {
  name: "Admin User",
  email: "admin@selectdresses.com",
  password: "Admin@12345",           // ← your admin password
  role: "admin",
  profile: {
    public_id: "default_admin",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"
  }
};

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log("⚠️  Admin already exists:", ADMIN.email);
      console.log("   Role:", existing.role);
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(ADMIN.password, 10);

    await User.create({
      ...ADMIN,
      password: hashedPwd,
    });

    console.log("\n✅ Admin user created successfully!");
    console.log("═══════════════════════════════════");
    console.log("  Email    :", ADMIN.email);
    console.log("  Password :", ADMIN.password);
    console.log("  Role     :", ADMIN.role);
    console.log("═══════════════════════════════════");
    console.log("\nYou can now log in at http://localhost:5173/login");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
}

seed();
