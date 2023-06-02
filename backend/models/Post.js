import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;
const TrimStringType = { trim: true, type: String };
const UserIdType = { ref: "user", type: ObjectIdType };

const postSchema = new Schema(
    {
        images: [TrimStringType],
        user: { ...UserIdType, required: true },
        text: { trim: true, type: String, required: true },
        react: { ref: "react", required: true, type: ObjectIdType },
        privacy: { type: String, default: "PUBLIC", enum: ["FRIEND", "PUBLIC", "ONLY_ME"] },
        body: new Schema(
            { location: TrimStringType, feelings: TrimStringType, tag_friends: [UserIdType] },
            { _id: false }
        ),
    },
    { timestamps: true, versionKey: false }
);

const Post = model("post", postSchema);

export default Post;
