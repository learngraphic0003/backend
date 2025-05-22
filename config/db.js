const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1); // If the connection fails, it logs the error and stops the server (process.exit(1)).
    }
};

module.exports = connectDB;
