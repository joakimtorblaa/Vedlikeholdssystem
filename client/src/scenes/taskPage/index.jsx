import{ Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import Navbar from "../navbar";

const TaskPage = () => {
    const taskId = useParams();
    const token = useSelector((state) => state.token);
    const [task, setTask] = useState(null);
    const getTask = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${taskId.taskid}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        setTask(data);
        
    }

    useEffect(() => {
        getTask();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!task) {
        return null;
    }
    console.log(task);
    return (
        <Box>
            <Navbar/>
            <WidgetWrapper>
                <Box height="100px">
                    <Typography>
                    {task._id}
                    </Typography>
                    <Typography>
                    {task.taskName}
                    </Typography>
                    <Typography>
                    {task.taskStatus}
                    </Typography>
                </Box>
            </WidgetWrapper>
        </Box>
    )
}

export default TaskPage;