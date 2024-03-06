import * as dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

redisClient.on("connect", () => console.log("Connected to Redis"));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
