import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Adjust path if .env is outside backend/
dotenv.config();

// Default config if .env relies on specific values. 
// Replace with your actual MongoDB URL if the env doesn't load.
const MONGO_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/chatify";

// Define User schema if you don't want to rely on the model file exact path
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { strict: false });

const User = mongoose.model("User", userSchema);

const resetAuth = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${MONGO_URL}`);
        await mongoose.connect(MONGO_URL);
        console.log("Connected successfully!");

        const targetEmail = "shuklaharsh9752@gmail.com";
        const newPassword = "Harsh@123";

        // Remove any existing user with that email
        console.log(`Removing any existing user with email: ${targetEmail}`);
        await User.deleteMany({ email: targetEmail });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Create new user
        const newUser = new User({
            userName: "harsh", // Defaulted username, feel free to update in frontend later
            email: targetEmail,
            password: hashedPassword
        });

        await newUser.save();
        console.log("✅ User successfully created/reset!");
        console.log(`Email: ${targetEmail}`);
        console.log("Password: (Has been securely hashed and stored)");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error resetting user:", err);
        process.exit(1);
    }
}

resetAuth();
