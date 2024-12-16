import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const port=Number(process.env.REDIS_PORT)||6873;
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port,
  },
  password: process.env.REDIS_PASSWORD,
});


client.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Redis connection error:', err);
});


export default client;
