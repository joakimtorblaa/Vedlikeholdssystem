import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    users: {
        type: Array,
        default: []
    },
    latestMessage: {
        type: String
    }
},
{ timestamps: true }

)

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;