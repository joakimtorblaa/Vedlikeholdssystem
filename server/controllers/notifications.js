import Notification from "../models/Notification.js";

export const newNotification = async (req, res) => {
    console.log(req.body);
    try {
        const date = new Date();
        const {
            sender,
            content,
            reciever,
            location,
        } = req.body;

        const newNotification = new Notification ({
            sender,
            content,
            reciever,
            location,
            opened: false,
            createdAt: date.getDate() +"/"+ (date.getMonth()+1) +"/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        });

        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getUserNotifications = async (req, res) => {
    try {
        const { id } = req.params;
        const notifications = await Notification.find();
        const userNotifications = notifications.filter((notification) => notification.reciever === id); 
        res.status(200).json(userNotifications);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const setOpenedNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);
        notification.opened = true;
        await notification.save();
        res.status(201).json("Set opened to true");
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}