import { Add, Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import NewTaskForm from "../components/NewTaskForm";
import WidgetWrapper from "../components/WidgetWrapper";
import Pagination from "@mui/material/Pagination";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TaskListItem from "../components/TaskListItem";

const LocationTaskWidget = (widgetAdjust) => {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState(null);
    const token = useSelector((state) => state.token);
    const { locationId } = useParams();

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const getLocationTasks = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/locationId/${locationId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.length <= 0) {
                setTasks(null);
            } else {
                const filteredData = data.filter((task) => task.completed === false);
                setTasks(filteredData);
                setNoOfPages(Math.ceil(filteredData.length / itemsPerPage ));
            }
    }

    useEffect(() => {
        getLocationTasks();
    }, [locationId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper sx={{gridRow: widgetAdjust.gRow, gridColumn: widgetAdjust.gColumn}}>
            <Box>
            <Dialog open={open} onClose={handleClose}>
                    <DialogActions>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </DialogActions>
                    <DialogTitle
                        fontWeight="bold"
                        variant="h4"
                    >
                        Opprett ny oppgave
                    </DialogTitle>
                    <DialogContent>
                        <Box width="500px">
                             <NewTaskForm/>
                        </Box>
                    </DialogContent>
                </Dialog>
                <List
                    dense={true}
                >
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="add" onClick={handleOpen}>
                                <Add/>
                            </IconButton>
                        }
                    >
                        <Typography
                            fontWeight="bold"
                            variant="h4"
                        >
                            Pågående oppgaver
                        </Typography>
                    </ListItem>
                    <Divider/>
                    {!tasks ? (
                        <ListItem key="noOngoingTasks">
                            <ListItemText primary="Ingen oppgaver funnet. Klikk på ikonet til høyre for å opprette en oppgave knyttet til denne lokasjonen."/>
                        </ListItem>
                    ) : (
                        tasks
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((task) => (
                            <TaskListItem key={task._id} taskInfo={task} />
                        ))
                    )}
                </List>
                <Box 
                    display="flex"
                    justifyContent="center"
                >
                    <Pagination 
                        count={noOfPages}
                        page={page}
                        onChange={handlePage}
                        defaultPage={1}
                        color="primary"
                        size="medium"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Box>
        </WidgetWrapper>
    )
}

export default LocationTaskWidget;