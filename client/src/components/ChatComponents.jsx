import { useTheme } from "@emotion/react"
import { Button, Dialog, DialogContent, DialogTitle, Input, InputAdornment, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@mui/material";
import { Search } from '@mui/icons-material';
import { Box } from "@mui/system"
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
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
        socket.emit('readMessage', {id: id, user: user});
    }, [socket, id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getUserChats();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('latestMessageResponse', () => patchLatest());
    }, [socket]);// eslint-disable-line react-hooks/exhaustive-deps

    if (!userChats) {
        return null;
    }
    return (
        <Box
            display="flex"
            height="100%"
            width="250px"
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
                            <ChatListComponent socket={socket} user={item.users} chat={item.latestMessage} chatid={item._id} unread={item.unreadMessage} />
                        </ListItem>
                    )  : (
                        <ListItem 
                            key={item._id}
                            onClick={() => setChat(item._id)} 
                            sx={[
                                {'&:hover':{cursor: 'pointer', backgroundColor: palette.neutral.mediumLight}}
                            ]}
                        >
                            <ChatListComponent socket={socket} user={item.users} chat={item.latestMessage} chatid={item._id} unread={item.unreadMessage} />
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

const NewChat = ({socket}) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const { palette } = useTheme();

    const initialChatValues = {
        chatUser: "",
        latestMessage: ""
    }

    const chatSchema = yup.object().shape({
        chatUser: yup.string().required("Error"),
    });

    const getUsers = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        let filteredData = data.filter(item => !(item._id === userId));
        filteredData.sort((a, b) => {
            const nameA = a.fullName.toLowerCase();
            const nameB = b.fullName.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            //names must be equal
            return 0;
        });
        setUsers(filteredData);
    }

    const newChat = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('content', 'Start på ny samtale');
        formData.append('users', [values.chatUser, userId]);

        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/newChat`,
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        
        if (data) {
            handleClose();
            navigate(`/messages/${data}`);
            socket.emit('latestMessage');
        }
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
        console.log(values);
        await newChat(values, onSubmitProps);
    }

    if (!users){
        return null;
    }

    const filteredUsers = users.filter(
        ({fullName}) => 
        fullName.toLowerCase().includes(searchText.toLowerCase())
    )

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
                        <Box marginBottom="5px">
                            <TextField 
                                type="text" 
                                fullWidth 
                                placeholder="Søk etter bruker"
                                value={searchText}
                                onChange={({ target }) => setSearchText(target.value)}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Search />
                                      </InputAdornment>
                                    ),
                                  }}/>
                        </Box>
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={initialChatValues}
                            validationSchema={chatSchema}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                setFieldValue
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box 
                                        borderRadius="5px" 
                                        padding="5px" 
                                        height="200px" 
                                        width="100%" 
                                        overflow="auto" 
                                        backgroundColor={palette.neutral.light}
                                    >
                                        <List>
                                            {filteredUsers.map((user) => (
                                                selectedUser === user._id ? (
                                                    <ListItem
                                                        key={user._id}
                                                        onClick={() => {
                                                            setSelectedUser(user._id);
                                                            setFieldValue('chatUser', user._id, true);
                                                        }}
                                                        sx={[
                                                            {
                                                                '&:hover':{cursor: 'pointer'},
                                                                backgroundColor: palette.neutral.mediumLight
                                                            }
                                                        ]}
                                                    >
                                                        <Box paddingTop="2px" paddingRight="5px">
                                                            <UserImage image={user.picturePath} size="35px" /> 
                                                        </Box>
                                                        <ListItemText
                                                            primary={user.fullName}
                                                            secondary={user.role}
                                                            
                                                        />
                                                    </ListItem>
                                                ) : (
                                                    <ListItem
                                                        key={user._id}
                                                        onClick={() => {
                                                            setSelectedUser(user._id);
                                                            setFieldValue('chatUser', user._id, true);
                                                        }}
                                                        sx={[
                                                            {'&:hover':{cursor: 'pointer', backgroundColor: palette.neutral.mediumLight}}
                                                        ]}
                                                    >
                                                        <Box paddingTop="2px" paddingRight="5px">
                                                            <UserImage image={user.picturePath} size="35px" /> 
                                                        </Box>
                                                        <ListItemText
                                                            primary={user.fullName}
                                                            secondary={user.role}
                                                            
                                                        />
                                                    </ListItem>
                                                )
                                                
                                            ))}
                                        </List>
                                    </Box>
                                    <Input  
                                    type="hidden"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.chatUser}
                                            name="chatUser"
                                            error={Boolean(touched.chatUser) && Boolean(errors.chatUser)}
                                            helperText={touched.chatUser && errors.chatUser}
                                    />
                                    <Box width="100%" display="box">
                                        <Button sx={{float: "right"}} type="submit" onClick={() => console.log(values.chatUser)}>
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