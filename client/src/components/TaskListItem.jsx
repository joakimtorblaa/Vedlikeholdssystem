import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import TaskNavigateAuth from "../features/auth/TaskNavigateAuth";
import Collaborators from "./Collaborators";
import UserComponent from "./UserComponent";
import moment from "moment";

const TaskListItem = ({taskInfo}) => {
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
                    <TaskNavigateAuth taskAuth={taskInfo}/>
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
                            {taskInfo.taskName}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography>
                                    {taskInfo.description}
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                >
                                    {taskInfo.taskType}
                                </Typography>
                                <Typography>
                                    Status: {taskInfo.taskStatus}
                                </Typography>
                                <Typography>
                                    Opprettet av:
                                </Typography>
                                <UserComponent createdBy={taskInfo.userId}/>
                                
                                {taskInfo.collaborators.length === 0 ? (
                                    <Typography>
                                        Ingen tilknyttede brukere
                                    </Typography>
                                ) : (
                                    <Box>
                                        <Typography>
                                            Tilknyttede brukere
                                        </Typography>
                                        <Collaborators collaborator={taskInfo.collaborators}/>
                                    </Box>
                                )}
                                
                                
                            </DialogContentText>
                        </DialogContent>
                    </Box>
                </Dialog>
                
                <ListItemButton onClick={handleOpen}>
                    <ListItemText
                        primary={taskInfo.taskName}
                        secondary={`${taskInfo.taskType} - Opprettet ${moment(taskInfo.createdAt).utc().format('DD.MM.YY')} av ${taskInfo.createdBy}`}
                    />
                </ListItemButton>
            </ListItem>  
        </>
    )
}
export default TaskListItem;