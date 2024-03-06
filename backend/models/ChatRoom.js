import mongoose from "mongoose";

const { model, Schema } = mongoose;

const UserIdType = { ref: "user", type: Schema.Types.ObjectId };
const DefaultStringType = { trim: true, default: "", type: String };

const chatRoomSchema = new Schema(
  {
    admin: UserIdType,
    members: [UserIdType],
    name: DefaultStringType,
    avatar_image: DefaultStringType,
    is_public: { default: true, type: Boolean },
  },
  { timestamps: true, versionKey: false }
);

const ChatRoom = model("chat-room", chatRoomSchema);

export default ChatRoom;
