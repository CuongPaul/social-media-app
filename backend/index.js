import cors from "cors";
import express from "express";
import Server from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createServer } from "http";

import socketServer from "./socket";
import UserRoutes from "./routes/User";
import AuthRoutes from "./routes/Auth";
import PostRoutes from "./routes/Post";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
socketServer(io);

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    io.req = req;
    req.io = io;
    next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/post", PostRoutes);

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("database connected");
        httpServer.listen(PORT, () => console.log(`server started on port ${PORT}`));
    })
    .catch((err) => console.log(err));
