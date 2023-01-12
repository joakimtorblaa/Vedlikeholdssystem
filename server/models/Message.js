import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    chatId: {
        type: String,
        required: true
    },
},
    { 
        timestamps: true
    }

)
const Message = mongoose.model("Message", MessageSchema);
export default Message;