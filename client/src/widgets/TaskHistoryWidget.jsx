import { List, ListItem, ListItemText, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const TaskHistoryWidget = ({socket}) => {
    
    const token = useSelector((state) => state.token);
    const { id } = useParams();

    const [list, setList] = useState([]);

    const getTaskHistory = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/history`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        
        if (data) {
            const parsedList = data.map((item) => (
                JSON.parse(item)
            ));
            setList(parsedList.slice(0).reverse());
            setNoOfPages(Math.ceil(parsedList.length / itemsPerPage));
        }
    }
    
    /* HANDLE PAGINATION */
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }
    const handleNewHistory = (data) => {
        if (data === id) {
            getTaskHistory();
        }
    }

    useEffect(() => {
        //setList(history.slice(0).reverse());
        getTaskHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('refreshHistory', (data) => handleNewHistory(data));
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

    console.log(list);
    return (
        <Box>
            <Typography
                    variant="h3"
                    fontWeight="bold"
                >
                    Oppgavehistorikk
                </Typography>
                <List>
                    {list
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText 
                                primary={item.content}
                                secondary={item.timestamp}
                            />
                        </ListItem>
                    ))}
                </List>
                {list.length > 5 ? (
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
                ) : (
                    <></>
                )}
        </Box>
    )
}

export default TaskHistoryWidget;