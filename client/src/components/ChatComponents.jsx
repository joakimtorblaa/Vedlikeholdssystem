import { useTheme } from "@emotion/react"
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system"
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
    const [latestMessage, setLatestMessage] = useState(null);


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
            width="30%"
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

const MessageForm = () => {

}

export {ChatList, MessageComponent};