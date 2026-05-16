import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
export const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: process.env.REDIS_URL?.startsWith('rediss://'), 
        rejectUnauthorized: false
    }

});


redisClient.on('error', (err) => console.error(' Redis Client Error:', err));

// Main Infrastructure Bootstrapper
const connectInfrastructure = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Connected');

        // Connect to Redis
        await redisClient.connect();
        console.log(' Redis Connected');
    } catch (err) {
        console.error(' Infrastructure Connection Failed:', err.message);
        process.exit(1);
    }
};

export default connectInfrastructure;