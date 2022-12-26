import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        fullName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        userType: {
            type: String,
            required: true,
            default: "User",
        },
        phoneNumber: {
            type: Number,
            required: true,
            min: 8,
        },
        role: {
            type: String,
            required: true,
            min: 5,
        },
        team: {
            type: Array,
            default: []
        },
        picturePath: {
            type: String,
            default: "../public/assets/placeholder/profile.png",
        },   

    }, { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;