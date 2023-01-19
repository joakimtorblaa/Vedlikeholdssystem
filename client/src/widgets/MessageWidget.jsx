import { Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import titleNotifications from "../hooks/titleNotifications";
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { AttachFile, Send } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useLocation, useParams } from "react-router-dom";
import { MessageComponent } from "../components/ChatComponents";
import { useRef } from "react";

const messageSchema = yup.object().shape({
    content: yup.string()
});

const initialValues = {
    content: ""
}

const MessageWidget = ({socket}) => {
    const { id } = useParams();
    const { palette } = useTheme();
    const messagesEnd = useRef();
    const location = useLocation();
    const notifications = useSelector((state) => state.notifications);
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUserInfo, setChatUserInfo] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const [placeholder, setPlaceholder] = useState(false);
    
    const newMessage = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('sender', user);
        formData.append('content', values.content);
        formData.append('chatId', id)
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/new`,
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const newMessage = await response.json();
        
        if (newMessage) {
            socket.emit('message', {
                _id: newMessage._id,
                sender: newMessage.sender,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                socketID: socket.id
            },
            {
                id: id
            }
            );
            
            const recipient = chatUsers.filter((r) => r !== user);
            socket.emit('notifyNewMessage', {recipient: recipient, location: location.pathname, id: id});
            socket.emit('latestMessage');
            setMessages([...messages, newMessage])
            onSubmitProps.resetForm();
        }
        
    }

    const getChat = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/chats/${id}/users`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        setChatUsers(data);
    }
        
    
    const getMessagesAndUsers = async () => {
        const messageResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/${id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const messageData = await messageResponse.json();
        const userResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/getMultiple/${JSON.stringify(chatUsers)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        const userData = await userResponse.json();

        setChatUserInfo(userData);
        
        //handle if no messages exists
        if(messageData.length === 0){
            setPlaceholder(true);
            setMessages([{content: 'Start på ny samtale'}]);
        } else {
            setPlaceholder(false);
            setMessages(messageData);
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        if (messages === null || messages.length === 0) {
            //await newChat(values, onSubmitProps);
        } else {
            await newMessage(values, onSubmitProps);
            
        }   
    }

    useEffect(() => {
        if (currentId !== id) {
            setMessages([]);
            getChat();
            setCurrentId(id);
        } else if (messages.length === 0 && chatUsers.length !== 0) {
            getMessagesAndUsers();
        }
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages, chatUsers, id]); //eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        messagesEnd.current?.scrollIntoView(0);
    }, [messages]); //eslint-disable-line react-hooks/exhaustive-deps
    
    if (!chatUserInfo || !messages) {
        return null;
    }

    return(
        <Box height="100%" display="flex" flexDirection="column" alignItems="flex-start">
        <Helmet>
            <title>{titleNotifications(notifications)}{id}</title>
            <meta name='description' content='Meldinger' />
        </Helmet>
            <Box 
                display="box"
                height="100%"
                width="100%"
                padding="20px"
                overflow="auto"
                sx={{ 
                    backgroundColor: palette.neutral.light,
                    borderRadius: 2,
                    }}
            >
                <List>
                    {messages.length === 1 && placeholder === true ? (
                        <ListItem>
                            <ListItemText primary={messages[0].content} />
                        </ListItem>
                    ) : (
                        messages.map((item, index) => (
                            chatUserInfo.map((info) => (
                                item.sender === info._id && item.sender === user ? (
                                    <ListItem key={item._id}>
                                        <MessageComponent orientation={"row-reverse"} userInfo={info} message={item.content}/>
                                    </ListItem>
                                ) : item.sender === info._id ? (
                                    <ListItem key={item._id}>
                                        <MessageComponent orientation={"row"} userInfo={info} message={item.content}/>
                                    </ListItem>
                                ) : (
                                    null
                                ) 
                            ))
                        ))
                    )}
                </List>
                <div
                    ref={messagesEnd}>
                </div>
            </Box>
            <Box max-height="15%" alignSelf="stretch">
                <Box>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={messageSchema}
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
                                    sx={{
                                        paddingTop: "1rem",
                                        height: "15%",
                                    }}
                                    fullWidth
                                    minRows={1}
                                    maxRows={3}
                                    margin="none"
                                    multiline
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.content}
                                    name="content"
                                    error={Boolean(touched.content) && Boolean(errors.content)}
                                    helperText={touched.content && errors.content}
                                />
                                <Button
                                    type="submit"
                                    sx={{
                                        float: "right",
                                        marginTop: "1rem",
                                        marginLeft: "10px",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.light,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                   <Send/>
                                </Button>
                                <Button
                                    sx={{
                                        float: "right",
                                        marginTop: "1rem",
                                        marginRight: "10px",
                                        marginLeft: "10px",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.light,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                   <AttachFile />
                                </Button>
                                
                        </form>
                        
                    )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    )
}

export default MessageWidget;