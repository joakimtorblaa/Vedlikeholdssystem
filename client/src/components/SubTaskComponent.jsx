import { useTheme } from "@emotion/react";
import { OpenInNew } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const SubTaskComponent = ({info}) => {
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const [task, setTask] = useState(null);
    const navigate = useNavigate();

    const getTask = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${info}`,
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
    }, [info]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!task) {
        return null;
    }

    return (
        <Box
            width="230px"
            sx={{
                border: 1,
                borderColor: palette.neutral.light 
            }} 
            
            borderRadius="10px" 
            padding="10px" 
            marginBottom="5px"
        >
            <FlexBetween>
                <Box>
                    <Typography fontWeight="bold"  maxWidth="180px" overflow="hidden" whiteSpace="nowrap" sx={{ textOverflow: 'ellipsis' }}>
                        {task.taskName}
                    </Typography>
                    <Typography fontSize="small">
                        {task.taskType}
                    </Typography>
                    <Typography fontSize="small">
                       Status: {task.taskStatus}
                    </Typography>
                </Box>
                
                <IconButton size="small" onClick={() => navigate(`/task/${info}`)}>
                    <OpenInNew/>
                </IconButton>
            </FlexBetween>
        </Box>
    )
}

export default SubTaskComponent;