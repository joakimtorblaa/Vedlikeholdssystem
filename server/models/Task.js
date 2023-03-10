import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
            min: 2,
        },
        taskType: {
            type: String,
            required: true,
            default: "Vedlikehold",
        },
        description: {
            type: String,
            required: true,
            min: 5,
        },
        taskStatus: {
            type: String,
            default: "Nylig opprettet"
        },
        locationId: {
            type: String,
            required: true,
        },
        comments: {
            type: Array,
            default: []
        },
        subTask: {
            type: Array,
            default: [],
        },
        taskFiles:{
            type: Array,
            default: [],
        },
        collaborators: {
            type: Array,
            default: []
        },
        history: {
            type: Array,
            default: [] 
        },
        disabled: {
            type: Boolean,
            default: false
        },
        startDate: Date,
        deadline: Date,
        createdBy: String,
        userId: String,

    }, { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;