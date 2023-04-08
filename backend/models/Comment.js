import mongoose from "mongoose";

const { model, Schema } = mongoose;

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    body: {
        image: String,
        text: {
            type: String,
            trim: true,
        },
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model("Comment", commentSchema);
