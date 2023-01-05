import { Edit, PersonAdd, UploadFile } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "../components/FlexBetween";
import TaskDisable from "../components/TaskDisable";
import TaskStatusUpdate from "../components/TaskStatusUpdate";
import TaskDelete from "../features/auth/TaskDeleteAuth";

const TaskControlWidget = (task) => {

    const {
        collaborators,
        taskName,
        taskStatus,
        userId
    } = task.task;

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
            <Box>
                <FlexBetween>
                    <TaskStatusUpdate status={taskStatus} users={users} task={taskName}/>
                </FlexBetween>
                <FlexBetween padding="1rem 0">
                    <Button variant="outlined" color="info">
                        <PersonAdd /> legg til bruker
                    </Button>

                    <Button variant="outlined" color="info">
                        <UploadFile/> last opp fil
                    </Button>
                    
                    <Button variant="outlined" color="info">
                        <Edit/> endre oppgave
                    </Button>
                    <TaskDelete allowedRoles={'admin'} user={userId} handleOpen={handleOpen} />
                </FlexBetween>
            </Box>
        </Box>
    )
}

export default TaskControlWidget;