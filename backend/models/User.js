import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;
const stringDefaultType = { trim: true, default: "", type: String };

const userSchema = new Schema(
    {
        location: {
            type: Object,
        },
        is_active: {
            default: true,
            type: Boolean,
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
        jwt_token: [
            {
                trim: true,
                type: String,
            },
        ],
        bio: stringDefaultType,
        education: stringDefaultType,
        socket_id: stringDefaultType,
        cover_image: stringDefaultType,
        avatar_image: stringDefaultType,
        friends: [{ ref: "User", type: objectIdType }],
    },
    { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

const userModel = model("User", userSchema);

export default userModel;
