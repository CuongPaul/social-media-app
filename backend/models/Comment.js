import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;

const commentSchema = new Schema(
    {
        image: { trim: true, type: String },
        text: { trim: true, type: String, required: true },
        post: { ref: "post", required: true, type: ObjectIdType },
        user: { ref: "user", required: true, type: ObjectIdType },
        react: { ref: "react", required: true, type: ObjectIdType },
    },
    { timestamps: true, versionKey: false }
);

const Comment = model("comment", commentSchema);

export default Comment;
