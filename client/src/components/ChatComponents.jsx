import { useTheme } from "@emotion/react"
import { List, ListItem, ListItemText } from "@mui/material";
import { Box } from "@mui/system"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatListComponent from "./ChatListComponent";


const ChatList = () => {
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [userChats, setUserChats] = useState(null);

    const getUserChats = async () => {
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/chats/${user}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserChats(data);
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
                <ListItem 
                    key={item._id}
                    onClick={() => console.log('test')} 
                    sx={[
                        {'&:hover':{cursor: 'pointer'}}
                    ]}
                >
                    <ChatListComponent user={item.users} chat={item.latestMessage}/>
                </ListItem>
                ))}
            </List>
        </Box>
    )
}

const MessageList = () => {

}

const MessageForm = () => {

}

export {ChatList};