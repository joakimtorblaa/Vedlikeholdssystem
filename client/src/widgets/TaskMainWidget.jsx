import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";
import moment from "moment";
import UserComponent from "../components/UserComponent";
import Collaborators from "../components/Collaborators";
import LocationComponent from "../components/LocationComponent";
import TaskStatusUpdate from "../components/TaskStatusUpdate";
import TaskDelete from "../features/auth/TaskDeleteAuth";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Edit, PersonAdd, Settings, UploadFile } from "@mui/icons-material";

const TaskMainWidget = (task) => {
    console.log(task.task);
    const {
        _id,
        collaborators,
        completed,
        createdAt,
        createdBy,
        deadline,
        description,
        locationId,
        history,
        startDate,
        subTask,
        taskFiles,
        taskName,
        taskStatus,
        taskType,
        updatedAt,
        userId
    } = task.task;

    const historyList = history.map((item) => (
        JSON.parse(item)
    ));

    const user = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }


    return (
        <WidgetWrapper>
            <Box 
                display="grid"
                gridAutoColumns="1fr"
                gap="20px"
                minHeight="100px"
            >
                {/* Task information */}
                <Box sx={{gridRow: 1, gridColumn: "span 1"}} gap="10px">
                    <Typography
                        variant="h1"
                        fontWeight="bold"
                    >
                    {taskName}
                    </Typography>
                    <Typography
                        variant="h3"
                    >
                        {taskType}
                    </Typography>
                    <LocationComponent locationId={locationId}/>

                    <Typography paddingTop="5px">
                        <b>Status:</b> {taskStatus}
                    </Typography>
                    <FlexBetween padding="5px 0">
                        <Typography>
                            <b>Startdato:</b> {moment(startDate).utc().format('DD.MM.YY')}
                        </Typography>
                        <Typography>
                            <b>Oppgavefrist:</b> {moment(deadline).utc().format('DD.MM.YY')}
                        </Typography>
                    </FlexBetween>
                    <Divider />
                    <Typography
                        padding="5px 0"
                        variant="h5"
                    >
                        Oppgavebeskrivelse:
                    </Typography>
                    <Typography padding="5px 0">
                        {description}
                    </Typography>
                    <Divider/>
                    <Typography padding="5px 0">
                        Opprettet den {moment(createdAt).utc().format('DD.MM.YY')} av:
                    </Typography>
                    <Box width="50%">
                        <UserComponent createdBy={userId}/>
                    </Box>
                    {collaborators[0].length > 0 ? (
                        <Box width="50%">
                            <Typography
                                padding="5px 0"
                                variant="h5"
                            >
                                Medvirkende
                            </Typography>
                            <Collaborators collaborator={collaborators}/>
                        </Box>
                    ) : (
                        <>
                        </>
                    )}
                    
                    
                </Box>
                
                {/* Task controls */}
                <Box sx={{gridRow: 1, gridColumn: "span 1"}}>
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
                            <Button >
                                Slett oppgave
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                    >
                        Oppgavekontroll
                    </Typography>
                    <Box>
                        <FlexBetween padding="1rem">
                            <TaskStatusUpdate status={taskStatus}/>
                            <TaskStatusUpdate status={taskStatus}/>
                            <TaskStatusUpdate status={taskStatus}/>
                        </FlexBetween>
                        <FlexBetween padding="1rem">
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
                {/* Task history */}
                <Box sx={{gridRow: 2, gridColumn: "span 1"}}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                    >
                        Oppgavehistorikk
                    </Typography>
                    <List>
                        {historyList.reverse().map((item) => (
                            <ListItem key={item.id}>
                                <ListItemText 
                                    primary={item.content}
                                    secondary={item.timestamp}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {/* Task comments */}
                <Box sx={{gridRow: 2, gridColumn: "span 1"}}>
                </Box>
            </Box>
        </WidgetWrapper>
    )
}

export default TaskMainWidget;