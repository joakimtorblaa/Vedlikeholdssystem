import { Box, List, Button, TextField, ListItemText, Pagination, Typography, ListItem } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from 'yup';
import handleNotifications from "../hooks/handleNotifications";
import taskCompleted from "../hooks/taskCompleted";

const commentSchema = yup.object().shape({
    comment: yup.string().max(255).required(),
});

const initialCommentValues = {
    comment: '',
}

const TaskComments = ({users, task, status, socket}) => {
    const { id } = useParams();
    const fullName = useSelector((state) => state.fullName);
    const token = useSelector((state) => state.token);
    const [comments, setComments] = useState([]);

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }

    const addTaskComment = async (values, onSubmitProps) => {
        
        //eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/comments/${values.comment}/${fullName}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            }
        )
        onSubmitProps.resetForm();
        for (let user in users) {
            handleNotifications(fullName, `${fullName} la til en kommentar på ${task}.`, users[user], `/task/${id}`, token);
        }
        socket.emit('newComment', (id));
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await addTaskComment(values, onSubmitProps);
    }

    const getTaskComments = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/comments`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const fetchedComments = await response.json();
        const parsedArray = fetchedComments.slice(0).reverse().map(JSON.parse);
        if (parsedArray) {
            setComments(parsedArray);
            setNoOfPages(Math.ceil(parsedArray.length / itemsPerPage));
        }
    }

    const getCurrentTaskComments = (data) => {
        console.log(data);
        if (data === id) {
            getTaskComments();
        }
    }

    useEffect(() => {
        getTaskComments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('newTaskComment', (data) => getCurrentTaskComments(data))
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!comments) {
        return null;
    }

    return (
        <Box padding="0 1rem">
            <Box>
                <List dense={true}>
                    {comments.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText primary={item.content} secondary={`${item.postedBy} - ${item.timestamp}`} />
                        </ListItem>
                    ))}
                </List>
                <Box 
                    display="flex"
                    justifyContent="center"
                >
                    {comments.length > 5 ? (
                        <Box paddingBottom="1rem">
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
            </Box>
            {taskCompleted(status) ? <></> :
                <Box>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialCommentValues}
                    validationSchema={commentSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Kommentar"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.comment}
                                name="comment"
                                error={Boolean(touched.comment) && Boolean(errors.comment)}
                                inputProps={{ maxLength: 255 }}
                            />
                            <Typography>
                                Gjenstående karakterer: {255 - (values.comment.length)}
                            </Typography>
                            <Button type="submit"> 
                                Legg til kommentar
                            </Button>
                        </form>
                    )}
                    </Formik>
                </Box>
            }
            
        </Box>
    )
}

export default TaskComments;