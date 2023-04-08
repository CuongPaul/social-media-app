import mongoose from "mongoose";

const { model, Schema } = mongoose;

const chatSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        body: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

export default model("Chat", chatSchema);
