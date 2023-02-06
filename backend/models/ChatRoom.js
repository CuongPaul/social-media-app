import mongoose from "mongoose";

const { model, Schema } = mongoose;

const StringDefaultType = { trim: true, default: "", type: String };
const UserIdType = { ref: "user", required: true, type: Schema.Types.ObjectId };

const chatRoomSchema = new Schema(
    {
        members: [UserIdType],
        name: StringDefaultType,
        avatar_image: StringDefaultType,
        is_public: { default: true, type: Boolean },
        admin: { ref: "user", type: Schema.Types.ObjectId },
    },
    { timestamps: true, versionKey: false }
);

const ChatRoom = model("chat-room", chatRoomSchema);

export default ChatRoom;
