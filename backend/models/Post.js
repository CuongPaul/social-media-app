import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;
const TrimStringType = { trim: true, type: String };
const UserIdRefType = { ref: "user", required: true, type: ObjectIdType };

const postSchema = new Schema(
    {
        user: UserIdRefType,
        images: [TrimStringType],
        body: {
            location: TrimStringType,
            feelings: TrimStringType,
            tag_friends: [UserIdRefType],
        },
        react: { ref: "react", type: ObjectIdType },
        text: { trim: true, type: String, required: true },
        privacy: { type: String, enum: ["FRIEND", "PUBLIC", "ONLY_ME"] },
    },
    { timestamps: true, versionKey: false }
);

const Post = model("post", postSchema);

export default Post;
