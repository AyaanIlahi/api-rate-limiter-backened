import dotenv from 'dotenv';
dotenv.config({path:'./process.env'}); // Load environment variables

import { Redis } from '@upstash/redis';

// Setup Redis with Upstash REST API
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL, 
    token: process.env.UPSTASH_REDIS_REST_TOKEN, 
});

// Test Redis connection
/*async function testRedis() {
  try {
    await redis.set('test', 'Hello from Upstash!');
    const value = await redis.get('test');
    console.log('Redis Test Value:', value);
  } catch (err) {
    console.error('Redis Connection Error:', err);
  }
}
testRedis();*/

export { redis };