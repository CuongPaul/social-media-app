import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;
const userIdRefType = { ref: "User", type: objectIdType };
const stringDefaultType = { trim: true, default: "", type: String };

const userSchema = new Schema(
    {
        is_active: {
            default: true,
            type: Boolean,
            required: true,
        },
        name: {
            trim: true,
            type: String,
            required: true,
        },
        password: {
            trim: true,
            type: String,
            required: true,
        },
        email: {
            trim: true,
            type: String,
            unique: true,
            required: true,
        },
        friends: [userIdRefType],
        hometown: stringDefaultType,
        education: stringDefaultType,
        cover_image: stringDefaultType,
        socket_id: [stringDefaultType],
        avatar_image: stringDefaultType,
        block_notification: [userIdRefType],
    },
    { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

const userModel = model("User", userSchema);

export default userModel;
