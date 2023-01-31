import { Button, ListItemText, MenuItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import handleNotifications from "../hooks/handleNotifications";

    
    const TaskStatusUpdate = ({status, users, task, socket}) => {
        const navigate = useNavigate();
        const { id } = useParams();
        const token = useSelector((state) => state.token);
        const fullName = useSelector((state) => state.fullName);
        const [currentStatus, setCurrentStatus] = useState(status);
        const [changed, setChanged] = useState(true);

        const taskStatus = [
            "Nylig opprettet",
            "Påbegynt",
            "Venter på svar",
            "Satt på vent",
            "Forsinket",
            "Avsluttet",
            "Fullført"
        ]


        const updateTask = async () => {

            // eslint-disable-next-line
            const response = await fetch(
                `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/${currentStatus}/${fullName}`,
                {
                    method: "PATCH",
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            const data = await response.json();
            if (data) {
                if (currentStatus === 'Avsluttet' || currentStatus === 'Fullørt') {
                    for (let user in users) {
                        handleNotifications(fullName, `${fullName} lukket ${task}, da oppgaven er markert som ${currentStatus}.`, users[user], `/task/${id}`, token, socket);
                    }
                    console.log(currentStatus);
                    socket.emit('taskStatusUpdate', id);
                    socket.emit('newHistory', id);
                } else {
                    for (let user in users) {
                        handleNotifications(fullName, `${fullName} endret status på ${task} til ${currentStatus}.`, users[user], `/task/${id}`, token, socket);
                    }
                    console.log(currentStatus);
                    socket.emit('taskStatusUpdate', id);
                    socket.emit('newHistory', id);
                }
            }
        }

        useEffect(() => {
            setCurrentStatus(status);
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const handleUpdate = (status) => {
            if (status === "Fullført"){
                if (window.confirm("Er du sikker på at du vil markere oppgaven som fullført? Det vil ikke være mulig å gjøre endringer eller endre status etter oppgaven er markert som fullført.")){
                    updateTask();
                }
            } else if (status === "Avsluttet") {
                if (window.confirm("Er du sikker på at du vil markere oppgaven som Avsluttet? Det vil ikke være mulig å gjøre endringer eller endre status etter oppgaven er markert som Avsluttet.")) {
                    updateTask();
                }
            } else {
                updateTask();
            }
        }

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
                    <Button disabled={changed} onClick={() => handleUpdate(currentStatus)}>
                        Oppdater
                    </Button>
                </Box>
                
            </>
        )
    }

    export default TaskStatusUpdate;