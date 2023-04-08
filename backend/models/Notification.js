import mongoose from "mongoose";

const { model, Schema } = mongoose;

const notificationSchema = new Schema(
    {
        body: {
            type: String,
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default model("Notification", notificationSchema);
