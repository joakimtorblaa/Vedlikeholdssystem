import { Close, Edit, PersonAdd, PersonRemove } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import accessControl from "../hooks/accessControl";
import { TaskAddColabForm } from "./TaskControlForms";

const TaskDisable = () => {
    const { id } = useParams();
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const disableTask = async () => {
        //eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/disabled`, 
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const taskResponse = await response.json();
        if (taskResponse) {
            navigate(-1);
        }

    }

    return (
        <Button onClick={() => disableTask()}>
            Slett
        </Button>
    )

}


const TaskAddColab = ({allowedRoles, user, currentUsers}) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    
    const [roles, setRoles] = useState(null);
    const [open, setOpen] = useState(false);
    const [changed, setChanged] = useState(true);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const getUserRole = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        setRoles(accessControl(data));
    }

    

    if (!roles) {
        getUserRole();
        return null;
    }

    const content = (roles.some(role => allowedRoles.includes(role)) || userId === user
        ?   
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                    <TaskAddColabForm currentUsers={currentUsers} createdBy={user}/>
                </DialogContent>
            </Dialog>
            <Button variant="outlined" color="info" onClick={handleOpen}>
                <PersonAdd /> legg til bruker
            </Button>
        </Box>
            
        : <></>
       )
    return content;
}

const TaskRemoveColab = ({allowedRoles, user}) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const [roles, setRoles] = useState(null);

    const getUserRole = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        setRoles(accessControl(data));
    }

    if (!roles) {
        getUserRole();
        return null;
    }

    const content = (roles.some(role => allowedRoles.includes(role)) || userId === user
        ?   <Button variant="outlined" color="info">
                <PersonRemove /> fjern bruker
            </Button>
        : <></>
       )
    return content;
}

const TaskEdit = ({allowedRoles, user}) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const [roles, setRoles] = useState(null);

    const getUserRole = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        setRoles(accessControl(data));
    }

    if (!roles) {
        getUserRole();
        return null;
    }

    const content = (roles.some(role => allowedRoles.includes(role)) || userId === user
        ?   <Button variant="outlined" color="info">
                <Edit/>endre oppgave
            </Button>
        : <></>
       )
    return content;
}

export {TaskAddColab, TaskRemoveColab, TaskEdit, TaskDisable,};
