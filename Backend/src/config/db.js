const mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to Database successfully");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        console.error("Make sure:");
        console.error("1. Your IP is whitelisted in MongoDB Atlas");
        console.error("2. DB_URL in .env is correct");
        console.error("3. MongoDB credentials are valid");
    }
}
module.exports = connectDB;