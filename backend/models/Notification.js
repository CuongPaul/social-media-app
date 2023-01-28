import mongoose from "mongoose";

const { model, Schema } = mongoose;

const notificationSchema = new Schema(
    {
        key: {
            trim: true,
            type: String,
            required: true,
        },
        content: {
            trim: true,
            type: String,
            required: true,
        },
        is_read: {
            type: Boolean,
            default: false,
            required: true,
        },
        user: {
            ref: "User",
            required: true,
            type: Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

const notificationtModel = model("Notification", notificationSchema);

export default notificationtModel;
