import { useTheme } from "@emotion/react"
import { List, ListItem, ListItemText } from "@mui/material";
import { Box } from "@mui/system"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatListComponent from "./ChatListComponent";


const ChatList = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
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

    const setChat = (id) => {
        setCurrentChat(id);
        navigate(`/messages/${id}`);
    }

    useEffect(() => {
        getUserChats();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userChats) {
        return null;
    }

    return (
        <Box
            display="box"
            height="100%"
            width="30%"
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

const MessageList = (chat) => {
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [messages, setMessages] = useState(null);


    
    return (
        <Box
            display="box"
            height="100%"
            width="30%"
            sx={{ 
                backgroundColor: palette.neutral.light,
                borderRadius: 2,
            }}
        >
            
        </Box>
    )
}

const MessageForm = () => {

}

export {ChatList};