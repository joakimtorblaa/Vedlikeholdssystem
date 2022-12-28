import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const UserComponent = (info) => {
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const [user, setUser] = useState(null);
    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${info.createdBy}`,
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
        role,
        email,
        phoneNumber
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
        >
            <UserImage image={picturePath} size="60px"/>
            <Box padding="10px" width="100%">
                <FlexBetween>
                    <Box>
                        <Typography fontWeight="bold">
                            {fullName}
                        </Typography>
                        <Typography>
                            {role}
                        </Typography>  
                    </Box>
                    <Box>
                        <Typography>
                            {phoneNumber}
                        </Typography>
                        <Typography>
                            {email}
                        </Typography>  
                    </Box>
                </FlexBetween>
            </Box>
        </Box>
    )
}

export default UserComponent;