import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;

const notificationSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "POST-TAG_FRIEND",
                "CHATROOM-DELETE",
                "FRIEND_REQUEST-SEND",
                "CHATROOM-UPDATE_NAME",
                "CHATROOM-CHANGE_ADMIN",
                "FRIEND_REQUEST-ACCEPT",
            ],
        },
        post: { ref: "post", type: ObjectIdType },
        is_read: { type: Boolean, default: false },
        chat_room: { ref: "chat-room", type: ObjectIdType },
        content: { trim: true, type: String, required: true },
        user: { ref: "user", required: true, type: ObjectIdType },
        friend_request: { ref: "friend-request", type: ObjectIdType },
    },
    { timestamps: true, versionKey: false }
);

const Notification = model("notification", notificationSchema);

export default Notification;
