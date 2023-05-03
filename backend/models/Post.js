import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;
const TrimStringType = { trim: true, type: String };
const UserIdType = { ref: "user", type: ObjectIdType };

const postSchema = new Schema(
    {
        images: [TrimStringType],
        body: {
            location: TrimStringType,
            feelings: TrimStringType,
            tag_friends: [UserIdType],
        },
        user: { ...UserIdType, required: true },
        text: { trim: true, type: String, required: true },
        react: { ref: "react", required: true, type: ObjectIdType },
        privacy: { type: String, default: "PUBLIC", enum: ["FRIEND", "PUBLIC", "ONLY_ME"] },
    },
    { timestamps: true, versionKey: false }
);

const Post = model("post", postSchema);

export default Post;
