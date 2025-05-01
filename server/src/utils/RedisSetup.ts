import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create a Redis client
const client = createClient({
  url: "redis://127.0.0.1:6379", // Default Redis URL
});

client.on("error", (err) => console.error("Redis error:", err));

(async () => {
  await client.connect(); // Connect to Redis
  console.log("Connected to Redis");
})();


export default client;