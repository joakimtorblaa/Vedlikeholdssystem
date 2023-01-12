import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "./UserImage";

const ChatListComponent = ( chat ) => {
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const { palette } = useTheme();
    const [user, setUser] = useState(null);

    const getUser = async () => {
        let reciever = ''
        for (let item in chat.user) {
            if(chat.user[item] !== userId){
                reciever = chat.user[item];
            } 
        }
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${reciever}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);

    }

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null;
    }
    const {
        fullName,
        picturePath,
    } = user;

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
        >
            <UserImage image={picturePath} size="50px"/>
            <Box padding="10px" width="100%">
                <Typography fontWeight="bold">
                    {fullName}
                </Typography>
                <Typography>
                    {chat.chat}
                </Typography>
            </Box>
        </Box>
    )
}

export default ChatListComponent;