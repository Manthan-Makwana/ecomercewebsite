import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectMongoDatabase = async () => {
    try {
        // Try connecting to the provided MONGO_URI
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if local DB not found
        });
        console.log(`✅ MongoDB connected with server: ${mongoose.connection.host}`);
    } catch (error) {
        if (error.message.includes("ECONNREFUSED") || error.message.includes("timeout")) {
            console.warn("⚠️ Local MongoDB not found. Starting MongoDB Memory Server...");
            
            try {
                const mongoServer = await MongoMemoryServer.create();
                const mongoUri = mongoServer.getUri();
                
                await mongoose.connect(mongoUri);
                console.log(`✅ MongoDB Memory Server connected: ${mongoUri}`);
                console.log("💡 Note: Data will NOT be persisted across server restarts in Memory Mode.");
            } catch (memError) {
                console.error("❌ Failed to start Memory Server:", memError.message);
                process.exit(1);
            }
        } else {
            console.error("❌ MongoDB Connection Error:", error.message);
            process.exit(1);
        }
    }
};
