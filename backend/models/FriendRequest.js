import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;
const userIdRefType = { ref: "User", required: true, type: objectIdType };

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
