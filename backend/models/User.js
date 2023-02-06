import mongoose from "mongoose";

const { model, Schema } = mongoose;

const UserIdRefType = { ref: "user", type: Schema.Types.ObjectId };
const TrimStringType = { trim: true, type: String, required: true };
const StringDefaultType = { trim: true, default: "", type: String };

const userSchema = new Schema(
    {
        name: TrimStringType,
        password: TrimStringType,
        friends: [UserIdRefType],
        gender: StringDefaultType,
        hometown: StringDefaultType,
        block_users: [UserIdRefType],
        education: StringDefaultType,
        cover_image: StringDefaultType,
        socket_id: [StringDefaultType],
        avatar_image: StringDefaultType,
        is_active: { default: true, type: Boolean },
        email: { trim: true, type: String, unique: true, required: true },
    },
    { timestamps: true, versionKey: false }
);

const User = model("user", userSchema);

export default User;
