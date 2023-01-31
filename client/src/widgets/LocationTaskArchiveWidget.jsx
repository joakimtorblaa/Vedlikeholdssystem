import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import Pagination from "@mui/material/Pagination";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TaskListItem from "../components/TaskListItem";

const LocationTaskArchiveWidget = (widgetAdjust) => {
    const [tasks, setTasks] = useState(null);
    const token = useSelector((state) => state.token);
    const { id } = useParams();

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }

    const getLocationTasks = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/locationId/${id}`,
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
                const filteredData = data.filter((task) => task.taskStatus === 'Fullført' || task.taskStatus === 'Avsluttet');
                setTasks(filteredData.slice(0).reverse());
                setNoOfPages(Math.ceil(filteredData.length / itemsPerPage ));
            }
    }

    useEffect(() => {
        getLocationTasks();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper sx={{gridRow: widgetAdjust.gRow, gridColumn: widgetAdjust.gColumn}}>
            <Box>
                <List
                    dense={true}
                >
                    <ListItem>
                        <Typography
                            fontWeight="bold"
                            variant="h4"
                        >
                            Fullførte/avsluttede oppgaver
                        </Typography>
                    </ListItem>
                    <Divider/>
                    {!tasks ? (
                        <ListItem key="noOngoingTasks">
                            <ListItemText primary="Ingen oppgaver funnet. Klikk på ikonet til høyre for å opprette en oppgave knyttet til denne lokasjonen."/>
                        </ListItem>
                    ) : (
                        tasks
                        .slice((page -1 ) * itemsPerPage, page * itemsPerPage)
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

export default LocationTaskArchiveWidget;