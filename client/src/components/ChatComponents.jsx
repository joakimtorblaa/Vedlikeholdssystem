import { useTheme } from "@emotion/react"
import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system"
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatListComponent from "./ChatListComponent";
import UserImage from "./UserImage";


const ChatList = ({socket}) => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [userChats, setUserChats] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);


    const getUserChats = async () => {
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/chats/${user}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserChats(data);
    }

    const setChat = (chatId) => {
        socket.emit('leave-chat', {id: id});
        setCurrentChat(chatId);
        navigate(`/messages/${chatId}`);
    }
    const patchLatest = () => {
        getUserChats();
    }

    useEffect(() => {
        socket.emit('join-chat', {id: id});
    }, [socket, id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getUserChats();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('lastMessageResponse', () => patchLatest());
    }, [socket]);// eslint-disable-line react-hooks/exhaustive-deps

    if (!userChats) {
        return null;
    }
    return (
        <Box
            display="flex"
            height="100%"
            width="100%"
            flexDirection="column"
            sx={{ 
                backgroundColor: palette.neutral.light,
                borderRadius: 2,
                }}
        >
            <List>
                {userChats.map((item) => (
                    currentChat === item._id ? ( 
                        <ListItem 
                            key={item._id}
                            onClick={() => setChat(item._id)} 
                            sx={[
                                {'&:hover':{cursor: 'pointer'},
                                    backgroundColor: palette.neutral.mediumLight
                                }
                            ]}
                        >
                            <ChatListComponent user={item.users} chat={item.latestMessage}/>
                        </ListItem>
                    )  : (
                        <ListItem 
                            key={item._id}
                            onClick={() => setChat(item._id)} 
                            sx={[
                                {'&:hover':{cursor: 'pointer'},}
                            ]}
                        >
                            <ChatListComponent user={item.users} chat={item.latestMessage}/>
                        </ListItem>
                    )
                
                ))}
            </List>
        </Box>
    )
}

const MessageComponent = (info) => {
    const { palette } = useTheme();
    const {
        orientation,
        message,
        userInfo
    } = info;
    return (
        <Box
            height="auto"
            minWidth="50px"
            width="100%"
            display="flex"
            float="right"
            flexDirection={orientation}
            gap="5px"
        >
            <UserImage image={userInfo.picturePath} size="25px" /> 
            <Box
                alignSelf="flex-start"
                padding="5px"
                maxWidth="450px"
                sx={{ 
                    backgroundColor: palette.neutral.mediumLight,
                    borderRadius: 2
                }}
            >
                <Typography>
                    {message}
                </Typography>
            </Box>
        </Box>   
    )
}

const NewChat = () => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const [users, setUsers] = useState(null);
    const [chatUsers, setChatUsers] = useState(null);
    const [open, setOpen] = useState(false);

    const initialChatValues = {
        chatUser: "",
        latestMessage: ""
    }

    const getUsers = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        const filteredData = data.filter(item => !(item._id === userId));
        setUsers(filteredData);
    }

    const newChat = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('sender', userId);
        formData.append('content', values.content);
        formData.append('users', chatUsers);

        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/newChat`,
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
    }
    useEffect(() => {
        getUsers();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await newChat(values, onSubmitProps);
    }

    return(
        <Box width="100%" mt="20px">
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    fontWeight="bold"
                    variant="h4"
                >
                    Opprett ny samtale
                </DialogTitle>
                <DialogContent>
                    <Box width="500px">
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={initialChatValues}
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
                                    <Box>
                                    <TextField
                                            select
                                            label="Velg bruker"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.chatUser}
                                            name="chatUser"
                                            error={Boolean(touched.chatUsers) && Boolean(errors.chatUsers)}
                                            helperText={touched.chatUsers && errors.chatUsers}
                                            sx={{ gridColumn: "span 4"}}
                                        >
                                            <MenuItem key="0" disabled value="" label="Legg til bruker">
                                                Legg til bruker
                                            </MenuItem>
                                            {users && users.map((user) => (
                                                <MenuItem
                                                    key={user._id}
                                                    value={user._id}
                                                >
                                                    <ListItemText
                                                        primary={user.fullName}
                                                        secondary={user.role}
                                                    />
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box width="100%" display="box">
                                        <Button disabled={true} sx={{float: "right"}} onClick="submit">
                                            Opprett
                                        </Button>
                                        <Button sx={{float: "right"}} onClick={handleClose}>
                                            Avbryt
                                        </Button>
                                    </Box>
                                    
                                </form>
                            )}
                                
                        </Formik>
                    </Box>
                </DialogContent>
                
            </Dialog>
            <Button
                fullWidth
                onClick={() => handleOpen()}
            >
                Ny samtale
            </Button>
        </Box>
    )
}

export {ChatList, MessageComponent, NewChat};