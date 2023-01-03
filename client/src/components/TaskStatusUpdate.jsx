import { Button, ListItemText, MenuItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

    
    const TaskStatusUpdate = (status) => {
        const navigate = useNavigate();
        const taskId = useParams();
        const token = useSelector((state) => state.token);
        const fullName = useSelector((state) => state.fullName);
        const [currentStatus, setCurrentStatus] = useState(status.status);
        const [changed, setChanged] = useState(true);

        const taskStatus = [
            "Nylig opprettet",
            "Påbegynt",
            "Venter på svar",
            "Satt på vent",
            "Forsinket",
            "Avsluttet"
        ]


        const updateTask = async () => {

            // eslint-disable-next-line
            const response = await fetch(
                `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${taskId.taskid}/${currentStatus}/${fullName}`,
                {
                    method: "PATCH",
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
            
            navigate(0);
        }

        useEffect(() => {
            setCurrentStatus(status.status);
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const handleChange = (e) => {
            setCurrentStatus(e.target.value);
            setChanged(false);
        }
        return (
            <>  
                <Box
                    display="flex"
                >
                    <TextField
                        select
                        label="Oppdater status"
                        onChange={handleChange}
                        value={currentStatus}
                    >
                        {taskStatus.map((item) => (
                            <MenuItem  key={item} value={item}>
                                <ListItemText primary={item} />
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button disabled={changed} onClick={() => updateTask()}>
                        Oppdater
                    </Button>
                </Box>
                
            </>
        )
    }

    export default TaskStatusUpdate;