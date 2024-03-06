import cors from "cors";
import express from "express";
import Server from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createServer } from "http";
import bodyParser from "body-parser";
import { ValidationError } from "express-validation";

import routes from "./routes";
import socketServer from "./socket";

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
socketServer(io);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use(routes);

app.get("/healthcheck", (_req, res) => res.send("Ok"));

app.use((err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    const { params, query, body } = err.details;
    if (params || query || body) {
      return res.status(err.statusCode).json({
        message: params
          ? params[0].message
          : query
          ? query[0].message
          : body[0].message,
      });
    }
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

mongoose
  .connect(MONGODB_URI)
  .then(() =>
    httpServer.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    )
  )
  .catch((err) => console.log(err));
