import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import TaskNavigateAuth from "../features/auth/TaskNavigateAuth";
import Collaborators from "./Collaborators";
import UserComponent from "./UserComponent";

const TaskListItem = (task) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <>  
            <ListItem
                secondaryAction={
                    <TaskNavigateAuth taskAuth={task.taskInfo}/>
                }
            >
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <Box minWidth="500px">
                        <DialogActions>
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </DialogActions>
                        <DialogTitle
                            fontWeight="bold"
                            variant="h4"
                        >
                            {task.taskInfo.taskName}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography>
                                    {task.taskInfo.description}
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                >
                                    {task.taskInfo.taskType}
                                </Typography>
                                <Typography>
                                    Status: {task.taskInfo.taskStatus}
                                </Typography>
                                <Typography>
                                    Opprettet av:
                                </Typography>
                                <UserComponent createdBy={task.taskInfo.userId}/>
                                
                                {task.taskInfo.collaborators.length === 0 ? (
                                    <Typography>
                                        Ingen tilknyttede brukere
                                    </Typography>
                                ) : (
                                    <Box>
                                        <Typography>
                                            Tilknyttede brukere
                                        </Typography>
                                        <Collaborators collaborator={task.taskInfo.collaborators}/>
                                    </Box>
                                )}
                                
                                
                            </DialogContentText>
                        </DialogContent>
                    </Box>
                </Dialog>
                
                <ListItemButton onClick={handleOpen}>
                    <ListItemText
                        primary={task.taskInfo.taskName}
                        secondary={task.taskInfo.taskType + " - Opprettet av: " + task.taskInfo.createdBy }
                    />
                </ListItemButton>
            </ListItem>  
        </>
    )
}
export default TaskListItem;