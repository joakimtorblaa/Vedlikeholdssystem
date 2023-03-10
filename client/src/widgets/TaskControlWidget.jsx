import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "../components/FlexBetween";
import { TaskAddColab, TaskAddSubtask, TaskDisable, TaskEdit, TaskRemoveColab } from "../components/TaskControls";
import TaskStatusUpdate from "../components/TaskStatusUpdate";
import TaskDelete from "../features/auth/TaskDeleteAuth";
import taskCompleted from "../hooks/taskCompleted";

const TaskControlWidget = ({task, socket}) => {

    const {
        collaborators,
        taskName,
        taskStatus,
        userId,
    } = task;
    /* ADDING RECIEVERS OF NOTIFICATIONS */
    const user = useSelector((state) => state.user);
    
    let users = [];
    if (userId !== user){
        users.push(userId)
    }
    if (collaborators !== []) {
        collaborators.map((item) => {
            if (item !== user){
                users.push(item)
            }
        })
    }
    /* ADDING RECIEVERS OF NOTIFICATIONS */
    
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Er du sikker på at du vil slette denne oppgaven?
                    </DialogContentText>
                    <DialogContentText>
                        Det er ingen vei tilbake når oppgaven først er slettet.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Avbryt</Button>
                    <TaskDisable/>
                </DialogActions>
            </Dialog>
            {taskCompleted(taskStatus) ? 
                <>
                    <FlexBetween>
                        <TaskStatusUpdate allowedRoles={['admin']} user={userId} status={taskStatus} users={users} task={taskName} socket={socket}/>
                        <TaskDelete allowedRoles={'admin'} user={userId} handleOpen={handleOpen} />
                    </FlexBetween>
                    
                </> 
                :
                <Box>
                    <FlexBetween>
                        <TaskAddColab allowedRoles={'admin'} user={userId} currentUsers={collaborators} taskName={taskName} socket={socket}/>
                        <TaskRemoveColab allowedRoles={'admin'} user={userId} currentUsers={collaborators} taskName={taskName} socket={socket}/>
                        <TaskAddSubtask allowedRoles={'admin'} user={userId} currentUsers={collaborators} task={task} socket={socket}/>
                        <TaskEdit allowedRoles={'admin'} user={userId} task={task} socket={socket}/>
                    </FlexBetween>
                        <Box padding="1rem 0">
                            <FlexBetween>
                                <TaskStatusUpdate allowedRoles={['admin', 'user']} status={taskStatus} users={users} task={taskName} socket={socket}/>
                                <TaskDelete allowedRoles={'admin'} user={userId} handleOpen={handleOpen} />
                            </FlexBetween>
                        </Box>
                </Box>
            }
        </Box>
    )
}

export default TaskControlWidget;