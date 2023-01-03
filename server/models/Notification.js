import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        reciever: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true,
        },
        opened: {
            type: Boolean,
            default: false
        },
        createdAt: String,

    }, { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;