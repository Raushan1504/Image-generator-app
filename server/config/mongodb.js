import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from "mongoose";

// Setup for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly join the path to the parent directory's .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGO_URI;

const connectDM = async () => {
    try {
        if (!uri) {
            // This will trigger if the path is still wrong or the key name is different
            console.error("❌ MONGO_URI is undefined. Check your .env file path.");
            return;
        }

        await mongoose.connect(uri);
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Connection Error:", error.message);
    }
}

export default connectDM;