import{ Box, useMediaQuery} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TaskMainWidget from "../../widgets/TaskMainWidget";
import Navbar from "../navbar";

const TaskPage = () => {
    const { taskid } = useParams(); 
    const token = useSelector((state) => state.token);
    const [task, setTask] = useState(null);

    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const getTask = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${taskid}`,
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
    }, [taskid]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!task) {
        return null;
    }

    return (
        <Box>
            <Navbar/>
            <Box
                width={isNonMobileScreens ? "80%" : "93%"}
                m="2rem auto"
            >
                <TaskMainWidget task={task}/>
            </Box>
            
        </Box>
    )
}

export default TaskPage;