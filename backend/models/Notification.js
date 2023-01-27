import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;

const notificationSchema = new Schema(
    {
        body: {
            trim: true,
            type: String,
            required: true,
        },
        user: {
            ref: "User",
            required: true,
            type: objectIdType,
        },
    },
    { timestamps: true }
);

const notificationtModel = model("Notification", notificationSchema);

export default notificationtModel;
