import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userIdRefType = { ref: "User", required: true, type: Schema.Types.ObjectId };

const friendRequestSchema = new Schema(
    {
        is_accepted: {
            type: Boolean,
            default: false,
        },
        sender: userIdRefType,
        receiver: userIdRefType,
    },
    { timestamps: true }
);

const friendRequestModel = model("FriendRequest", friendRequestSchema);

export default friendRequestModel;
