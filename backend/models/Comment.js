import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;

const commentSchema = new Schema(
  {
    text: { trim: true, type: String },
    image: { trim: true, type: String },
    react: { ref: "react", type: ObjectIdType },
    post: { ref: "post", required: true, type: ObjectIdType },
    user: { ref: "user", required: true, type: ObjectIdType },
  },
  { timestamps: true, versionKey: false }
);

const Comment = model("comment", commentSchema);

export default Comment;
