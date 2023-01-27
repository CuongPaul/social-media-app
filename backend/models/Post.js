import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userIdRefType = { ref: "User", required: true, type: Schema.Types.ObjectId };

const postSchema = new Schema(
    {
        content: {
            trim: true,
            type: String,
        },
        images: [
            {
                trim: true,
                type: String,
            },
        ],
        user: userIdRefType,
        reacts: {
            wow: [userIdRefType],
            sad: [userIdRefType],
            like: [userIdRefType],
            love: [userIdRefType],
            haha: [userIdRefType],
            angry: [userIdRefType],
        },
        body: {
            date: {
                trim: true,
                type: String,
            },
            location: {
                trim: true,
                type: String,
            },
            feelings: {
                trim: true,
                type: String,
            },
            with: [userIdRefType],
        },
        privacy: {
            type: String,
            default: "public",
            enum: ["only_me", "public"],
        },
    },
    { timestamps: true }
);

const postModel = model("Post", postSchema);

export default postModel;
