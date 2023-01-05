import { List, ListItem, ListItemText, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

const TaskHistoryWidget = (task) => {

    const {
        history
    } = task.task;

    const historyList = history.map((item) => (
        JSON.parse(item)
    ));
    
    /* HANDLE PAGINATION */
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }

    useEffect(() => {
        setNoOfPages(Math.ceil(historyList.length / itemsPerPage));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <Typography
                    variant="h3"
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
                {historyList.length > 5 ? (
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
                ) : (
                    <></>
                )}
        </Box>
    )
}

export default TaskHistoryWidget;