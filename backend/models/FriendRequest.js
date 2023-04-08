import mongoose from "mongoose";

const { model, Schema } = mongoose;

const FriendRequestSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default model("FriendRequest", FriendRequestSchema);
