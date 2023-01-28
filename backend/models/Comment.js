import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;

const commentSchema = new Schema(
    {
        react: {
            ref: "React",
            type: objectIdType,
        },
        post: {
            ref: "Post",
            required: true,
            type: objectIdType,
        },
        user: {
            ref: "User",
            required: true,
            type: objectIdType,
        },
        content: {
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
    },
    { timestamps: true }
);

const commentModel = model("Comment", commentSchema);

export default commentModel;
