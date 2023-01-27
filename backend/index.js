import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

import socketServer from "./socket";
import AuthRoutes from "./routes/auth";
import PostRoutes from "./routes/post";
import UserRoutes from "./routes/user";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/social-media-app";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
socketServer(io);

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    io.req = req;
    req.io = io;

    next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/user", UserRoutes);

mongoose
    .connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
