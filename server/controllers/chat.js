import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const newChat = async (req, res) => {
    try {
        const {
            sender,
            content,
        } = req.body;
        console.log(req.body);
        let splitUsers = []
        if (req.body.users.length > 0) {
            splitUsers = req.body.users.split(",");
        }
        const newChat = new Chat({
            users: splitUsers,
            latestMessage: content
        });
        const savedChat = await newChat.save();
        console.log(savedChat._id.toString());
        console.log(req.body.content);
        const newMessage = new Message({
            sender: sender,
            content: content,
            chatId: savedChat._id.toString()
        });

        await newMessage.save();

        res.status(201).json(savedChat._id);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const newMessage = async (req, res) => {
    try {
        const {
            sender,
            content,
            chatId
        } = req.body;

        const newMessage = new Message({
            sender,
            content,
            chatId
        });
        const savedMessage = await newMessage.save();
        
        const patchChat = Chat.findById(chatId);
        patchChat.latestMessage = content;
        await patchChat.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await Message.find({ chatId: id })

        res.status(200).json(messages);        
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserChats = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.find({
            $expr: {
                $in: [id, "$users"]
            }
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}