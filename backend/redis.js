import redis from "redis";

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

export default redisClient;
