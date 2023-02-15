import { useTheme } from "@emotion/react";
import { Avatar, Divider, IconButton, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const CollaboratorComponent = (info) => {
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.target);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        <>
        <IconButton 
            onClick={handleClick}
            size="small"
        >
            <Avatar alt={fullName} src={`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/assets/${picturePath}`}/>
        </IconButton>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Box padding="5px">
            <Typography fontWeight="bold">
                {fullName}
            </Typography>
            <Typography>
                {role}
            </Typography>
            <Divider/>
            <Typography>
                Tlf: {phoneNumber}
            </Typography>
            <Typography>
                Mail: {email}
            </Typography>
            </Box>
            
        </Popover>
        </>
            
    )
}

export default CollaboratorComponent;