import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setMode, setLogout } from '../state';
import AdminNavigate from "../features/auth/AdminNavigateAuth";
import { DarkMode, LightMode, Logout, Person, Settings } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const AccountComponent = ({socket, image}) => {
    const fullName = useSelector((state) => state.fullName);
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.target);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>

            <Tooltip title="Min profil">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar 
                        sx={{ width: 32, height: 32 }}
                        alt={fullName}
                        src={`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/assets/${image}`}
                    />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >   
                <MenuItem>
                    <Person sx={{ marginRight: "5px" }}/> 
                    <Typography>
                        Min profil
                    </Typography>
                </MenuItem>
                <MenuItem>
                    <Settings sx={{ marginRight: "5px" }}/>
                    <Typography>
                        Innstillinger
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setMode())}>
                    {theme.palette.mode === "dark" ? (
                        <>
                            <LightMode sx={{ color: dark, marginRight: "5px"}} />
                            <Typography>Dagmodus</Typography>
                        </>
                    ) : (
                        <>
                            <DarkMode sx={{ marginRight: "5px" }}/>
                            <Typography>Nattmodus</Typography>
                        </>
                    )}
                </MenuItem>
                <Divider />
                <AdminNavigate allowedRoles={'admin'} />
                <MenuItem onClick={() => dispatch(setLogout())}>
                    <Logout sx={{ marginRight: "5px" }}/>
                    <Typography>
                        Logg ut
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

export default AccountComponent;