import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const newChat = async (req, res) => {
    try {
        const {
            content,
        } = req.body;
        console.log(req.body);
        let splitUsers = []
        if (req.body.users.length > 0) {
            splitUsers = req.body.users.split(",");
        }

        const existingChats = await Chat.find();
        let chatExists = false;
        let chatId;
        //For å sjekke om chat eksisterer fra før
        let checker = (arr, target) => target.every(v => arr.includes(v));

        for (let item in existingChats){
            if(checker(existingChats[item].users, splitUsers)){
                chatExists = true;
                chatId = existingChats[item]._id;
                break;
            }
        }
        console.log(chatExists);
        if(!chatExists){
            const newChat = new Chat({
                users: splitUsers,
                latestMessage: content
            });
            const savedChat = await newChat.save();
            chatId = savedChat._id;
        }

        res.status(201).json(chatId);
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

        const patchChat = await Chat.findById(chatId);
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
        res.status(404).json({ message: err.message });
    }
}

export const getChatUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findById(id);
        res.status(200).json(chat.users);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}