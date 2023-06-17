import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;

const UserIdType = { ref: "user", type: ObjectIdType };
const DefaultStringType = { trim: true, default: "", type: String };
const RequiredStringType = { trim: true, type: String, required: true };

const userSchema = new Schema(
    {
        friends: [UserIdType],
        name: RequiredStringType,
        block_users: [UserIdType],
        gender: DefaultStringType,
        hometown: DefaultStringType,
        education: DefaultStringType,
        password: RequiredStringType,
        cover_image: DefaultStringType,
        avatar_image: DefaultStringType,
        email: { unique: true, ...RequiredStringType },
        chat_rooms: [
            {
                _id: { ref: "chat-room", type: ObjectIdType },
                furthest_unseen_message: { ref: "message", type: ObjectIdType },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

const User = model("user", userSchema);

export default User;
