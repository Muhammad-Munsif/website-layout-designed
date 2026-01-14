const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = new User({
      username: "admin",
      email: "admin@nexus.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@nexus.com");
    console.log("🔑 Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
