import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;
const userIdRefType = { ref: "User", required: true, type: objectIdType };

const commentSchema = new Schema(
    {
        user: userIdRefType,
        post: {
            ref: "Post",
            required: true,
            type: objectIdType,
        },
        body: {
            required: true,
            type: {
                text: {
                    trim: true,
                    type: String,
                },
                image: {
                    trim: true,
                    type: String,
                },
            },
        },
        reacts: {
            wow: [userIdRefType],
            sad: [userIdRefType],
            like: [userIdRefType],
            love: [userIdRefType],
            haha: [userIdRefType],
            angry: [userIdRefType],
        },
    },
    { timestamps: true }
);

const commentModel = model("Comment", commentSchema);

export default commentModel;
