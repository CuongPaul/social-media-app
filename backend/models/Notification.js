import mongoose from "mongoose";

const { model, Schema } = mongoose;

const notificationSchema = new Schema(
    {
        content: { trim: true, type: String, required: true },
        is_read: { type: Boolean, default: false, required: true },
        user: { ref: "user", required: true, type: Schema.Types.ObjectId },
        type: {
            type: String,
            required: true,
            enum: [
                "MESSAGE",
                "REACT_POST",
                "COMMENT_POST",
                "REACT_COMMENT",
                "FRIEND_REQUEST",
                "POST-TAG_FRIEND",
                "CHATROOM-DELETE",
                "CHATROOM-CHANGE_ADMIN",
            ],
        },
    },
    { timestamps: true, versionKey: false }
);

const Notification = model("notification", notificationSchema);

export default Notification;
