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

        let splitColabs = []
        if (req.body.collaborators.length > 0) {
            splitColabs = req.body.collaborators.split(",");
        }

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

export const patchDescTask = async (req, res) => {
    try {
        const { id, title, description } = req.params;
        const task = await Task.findById(id);
        task.taskName = title;
        task.description = description;

        await task.save();
        res.status(201).json('Updated taskname/description');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const patchTypeTask = async (req, res) => {
    try {
        const { id, type } = req.params;
        const task = await Task.findById(id);
        task.taskType = type;

        await task.save();
        res.status(201).json('Updated tasktype');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const patchDateTask = async (req, res) => {
    try {
        const { id, startDate, deadline } = req.params;
        const task = await Task.findById(id);
        task.startDate = startDate;
        task.deadline = deadline;

        await task.save();
        res.status(201).json('Updated startdate/deadline');
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

        res.status(201).json('Added comment to task');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const addTaskCollaborator = async (req, res) => {
    try {
        const { id, collaborators } = req.params;
        const parsedCollaborators = JSON.parse(collaborators);

        const task = await Task.findById(id);
        for (let item in parsedCollaborators) {
            task.collaborators.push(parsedCollaborators[item])
        }
        await task.save();

        res.status(201).json('Added collaborator/s to task');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const removeTaskCollaborator = async (req, res) => {
    try {
        const { id, collaborators } = req.params;
        const parsedCollaborators = JSON.parse(collaborators);

        const task = await Task.findById(id);
        task.collaborators = task.collaborators.filter(i => !parsedCollaborators.includes(i));
        await task.save();
        
        res.status(201).json('Removed collaborator/s from task');
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const patchTaskSubtasks = async (req, res) => {
    try {
        const {id, subtasks} = req.params;
        const parsedSubtasks = JSON.parse(subtasks);
        
        const task = await Task.findById(id);
        console.log(task.subTask);
        console.log(parsedSubtasks);
        task.subTask = parsedSubtasks;
        await task.save();
        res.status(201).json(task.subTask);
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

export const getTaskHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        
        res.status(200).json(task.history);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getTaskFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        res.status(200).json(task.taskFiles);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const uploadFileTask = async (req, res) => {
    try {
        const { id, fullname } = req.params;
        const date = new Date();
        
        const newHistory = {
            id : uuidv4(),
            content : `${fullname} lastet opp ${req.file.originalname}`,
            timestamp : date.getDate() +"/"+ (date.getMonth()+1) +"/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        }
        const newHistoryString = JSON.stringify(newHistory);

        const task = await Task.findById(id);
        task.history.push(newHistoryString);
        task.taskFiles.push(req.file);
        await task.save();

        const newFile = task.taskFiles;
        res.status(201).json(newFile);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const deleteTaskFile = async (req, res) => {
    try {
        const { id, fileIndex } = req.params;
        const task = await Task.findById(id);

        task.taskFiles.splice(fileIndex, 1);

        await task.save();
        res.status(201).json('File deleted');
    } catch (err) {
        res.status(409).json({ message: err.message });
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