import{ Box, useMediaQuery} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TaskControlWidget from "../../widgets/TaskControlWidget";
import TaskMainWidget from "../../widgets/TaskMainWidget";
import Navbar from "../navbar";
import WidgetWrapper from "../../components/WidgetWrapper";
import TaskInteractionWidget from "../../widgets/TaskInteractionWidget";
import TaskHistoryWidget from "../../widgets/TaskHistoryWidget";
import titleNotifications from "../../hooks/titleNotifications";

const TaskPage = () => {
    const { id } = useParams(); 
    const token = useSelector((state) => state.token);
    const notifications = useSelector((state) => state.notifications);
    const [task, setTask] = useState(null);

    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const getTask = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}`,
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
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!task) {
        return null;
    }

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}{task.taskName}</title>
                <meta name='description' content='Oppgaveside' />
            </Helmet>
            <Navbar/>
            <Box
                width={isNonMobileScreens ? "80%" : "93%"}
                m="2rem auto"
            >
                <WidgetWrapper>
                    <Box
                        display="grid"
                        gridAutoColumns="1fr"
                        gap="20px"
                        minHeight="100px"
                    >  
                        <Box sx={{gridRow: 1, gridColumn: "span 1"}} gap="10px">
                            <TaskMainWidget task={task}/>
                        </Box>
                        <Box sx={{gridRow: 1, gridColumn: "span 1"}} gap="10px">
                            <TaskInteractionWidget task={task} />
                        </Box>
                        <Box sx={{gridRow: 2, gridColumn: "span 1"}} gap="10px">
                            <TaskControlWidget task={task} />
                        </Box>
                        <Box sx={{gridRow: 2, gridColumn: "span 1"}} gap="10px">
                            <TaskHistoryWidget task={task} />
                        </Box>
                    </Box>
                </WidgetWrapper>
            </Box>
        </Box>
    )
}

export default TaskPage;