import Task from '../models/Task.js';
export const newTask = async (req, res) => {
    try {
        const {
            taskName,
            description,
            taskType,
            locationId,
            createdBy,
            userId,
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
    
}

export const getLocationTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.find();
        const locationTasks = task.filter((task) => task.locationId === id);

        res.status(200).json(locationTasks);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }

}