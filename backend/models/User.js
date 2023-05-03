import mongoose from "mongoose";

const { model, Schema } = mongoose;

const UserIdType = { ref: "user", type: Schema.Types.ObjectId };
const DefaultStringType = { trim: true, default: "", type: String };
const RequiredStringType = { trim: true, type: String, required: true };

const userSchema = new Schema(
    {
        friends: [UserIdType],
        name: RequiredStringType,
        block_users: [UserIdType],
        gender: DefaultStringType,
        hometown: DefaultStringType,
        education: DefaultStringType,
        password: RequiredStringType,
        cover_image: DefaultStringType,
        avatar_image: DefaultStringType,
        is_active: { default: true, type: Boolean },
        email: { unique: true, ...RequiredStringType },
    },
    { timestamps: true, versionKey: false }
);

const User = model("user", userSchema);

export default User;
