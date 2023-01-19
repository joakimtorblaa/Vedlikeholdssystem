import { useTheme } from "@emotion/react";
import { Badge, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import UserImage from "./UserImage";

const ChatListComponent = ( {socket, user, chat, chatid, unread} ) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const location = useLocation();
    const { palette } = useTheme();
    const [chatUser, setChatUser] = useState(null);
    const [badgeCounter, setBadgeCounter] = useState(null);

    const getUser = async () => {
        let reciever = ''
        for (let item in user) {
            if(user[item] !== userId){
                reciever = user[item];
            } 
        }
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${reciever}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setChatUser(data);
        if (unread[user.indexOf(userId)] === true){
            setBadgeCounter(1);
        } else {
            setBadgeCounter(0);
        }
    }
    
    const patchNotification = (data) => {

        if (location.pathname !== `/messages/${chatid}`) {
            if (data.id === chatid) {
                if (data.recipient[0] === userId){
                    setBadgeCounter(1);
                }
            }
        } else if (location.pathname === `/messages/${chatid}`) {
            if (data.id === chatid) {
                socket.emit('readMessage', {id: chatid, user: userId});
                setBadgeCounter(0);
            }
        }
    }

    const patchReadMessage = (data) => {
        if (data.id === chatid) {
            if (data.user === userId){
                setBadgeCounter(0);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('notifyUserChat', (data) => patchNotification(data))
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        socket.on('setReadMessage', (data) => patchReadMessage(data))
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!chatUser || (!chatUser && !badgeCounter)) {
        return null;
    }
    const {
        fullName,
        picturePath,
    } = chatUser;

    return (
        <Box    
            display="flex" 
            sx={{
                border: 1,
                borderColor: palette.neutral.light 
            }} 
            borderRadius="10px" 
            padding="5px 5px 0 5px" 
            marginBottom="5px"
            width="100%"
            flexDirection="row"
            gap="10px"
        >   
            <Badge variant="dot" color="primary" badgeContent={badgeCounter}>
                <UserImage image={picturePath} size="50px"/>
            </Badge>
            <ListItemText primary={fullName} secondary={chat}/>
        </Box>
    )
}

export default ChatListComponent;