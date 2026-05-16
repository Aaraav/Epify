import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            if (retries > 5) return new Error('Max retries reached');
            return retries * 500; // wait 500ms, 1000ms, etc between retries
        }
    }
});

redisClient.on('error', (err) => console.error(' Redis Client Error:', err));

const connectInfrastructure = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Connected');

        await redisClient.connect();
        console.log(' Redis Connected');
    } catch (err) {
        console.error(' Infrastructure Connection Failed:', err.message);
        process.exit(1);
    }
};

export default connectInfrastructure;