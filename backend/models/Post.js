import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;
const userIdRefType = { ref: "User", required: true, type: objectIdType };

const postSchema = new Schema(
    {
        text: {
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
        react: {
            ref: "React",
            type: objectIdType,
        },
        body: {
            location: {
                trim: true,
                type: String,
            },
            feelings: {
                trim: true,
                type: String,
            },
            tag_friends: [userIdRefType],
        },
        privacy: {
            type: String,
            enum: ["friend", "public", "only_me"],
        },
    },
    { timestamps: true }
);

const postModel = model("Post", postSchema);

export default postModel;
