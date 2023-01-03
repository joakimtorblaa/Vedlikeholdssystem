import Task from '../models/Task.js';
import {v4 as uuidv4} from 'uuid';
export const newTask = async (req, res) => {
    try {
        const {
            taskName,
            description,
            taskType,
            locationId,
            createdBy,
            userId,
            history,
            startDate,
            deadline
        } = req.body;

        const splitColabs = req.body.collaborators.split(",");

        const newTask = new Task ({
            taskName,
            taskType,
            description,
            locationId,
            createdBy,
            userId,
            history,
            startDate,
            deadline,
            collaborators: splitColabs
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        res.status(200).json(task);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getLocationTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.find();

        const locationTasks = task.filter((task) => task.locationId === id);

        const nonDisabledTasks = locationTasks.filter((task) => task.disabled !== true);

        res.status(200).json(nonDisabledTasks);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }

}

export const updateTask = async (req, res) => {
    try {
        const { id, fullname, status } = req.params;
        const date = new Date();

        const newHistory = {
            id : uuidv4(),
            content : `${fullname} endret oppgavestatus til ${status}.`,
            timestamp : date.getDate() +"/"+ (date.getMonth()+1) +"/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        }
        const newHistoryString = JSON.stringify(newHistory);
        

        const task = await Task.findById(id);
        task.taskStatus = status;
        task.history.push(newHistoryString);
        await task.save();

        const newTask = task.history;

        res.status(201).json(newTask);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const addTaskComment = async (req, res) => {
    try {
        const { id, content, postedBy } = req.params;
        const date = new Date();

        const newComment = {
            id : uuidv4(),
            content : content,
            postedBy : postedBy,
            timestamp : date.getDate() +"/"+ (date.getMonth()+1) +"/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        }

        const newCommentString = JSON.stringify(newComment);

        const task = await Task.findById(id);
        task.comments.push(newCommentString);
        await task.save();

        res.status(201).json()
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const getTaskComments = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        res.status(200).json(task.comments);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const disableTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        task.disabled = true;
        await task.save();

        res.status(201).json(id + ' disabled');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}