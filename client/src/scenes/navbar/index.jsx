import { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    Menu,
    Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../../state';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween';
import AdminNavigate from '../../features/auth/AdminNavigateAuth';
import NotificationComponent from '../../components/NotificationComponent';
import MessageComponent from '../../components/MessagesComponent';

const Navbar = ({socket}) => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.fullName);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    return (
        <>
        {location.pathname === '/' || location.pathname.includes('admin') ? (
            <></>
        ) : (
            <FlexBetween padding="1rem 6%" backgroundColor={alt} z-index="20">
                <FlexBetween gap="1.75rem">
                    <Typography fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: "pointer"
                        },
                    }}>
                        Vedlikehold
                    </Typography>
                </FlexBetween>
                {/* DESKTOP NAV */}
                {isNonMobileScreens ? (
                    <FlexBetween gap="2rem">
                        <IconButton onClick={() => dispatch(setMode())}>
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: "25px"}} />
                            )}
                        </IconButton>
                        <MessageComponent socket={socket}/>
                        <NotificationComponent socket={socket}/>
                        <AdminNavigate allowedRoles={'admin'} />
                            
                        <FormControl variant="standard" value={user}>
                            <Select
                                value={user}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                            >
                                <MenuItem value={user}>
                                    <Typography>{user}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => dispatch(setLogout())}>Logg ut</MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                ) : (
                    <IconButton
                        onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    >
                        <Menu />
                    </IconButton>
                )}

                {/* MOBILE NAV */}
                {!isNonMobileScreens && isMobileMenuToggled && (
                    <Box
                        position="fixed"
                        right="0"
                        bottom="0"
                        height="100%"
                        zIndex="10"
                        maxWidth="500px"
                        minWidth="300px"
                        backgroundColor={background}
                    >
                        {/* CLOSE ICON */}
                        <Box display="flex" justifyContent="flex-end" p="1rem">
                            <IconButton
                                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                            >
                                <Close />
                            </IconButton>
                        </Box>

                        {/* MENU ITEM */}
                        <FlexBetween
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            gap="3rem"
                        >
                            <IconButton
                                onClick={() => dispatch(setMode())}
                                sx={{ fontSize: "25px" }}
                                >
                                {theme.palette.mode === "dark" ? (
                                    <DarkMode sx={{ fontSize: "25px" }} />
                                ) : (
                                    <LightMode sx={{ color: dark, fontSize: "25px" }} />
                                )}
                            </IconButton>
                            <MessageComponent socket={socket}/>
                            <NotificationComponent socket={socket}/>
                            <AdminNavigate allowedRoles={'admin'} />
                            <FormControl variant="standard" value={user}>
                                <Select
                                    value={user}
                                    sx={{
                                        backgroundColor: neutralLight,
                                        width: "150px",
                                        borderRadius: "0.25rem",
                                        p: "0.25rem 1rem",
                                        "& .MuiSvgIcon-root": {
                                            pr: "0.25rem",
                                            width: "3rem",
                                        },
                                        "& .MuiSelect-select:focus": {
                                            backgroundColor: neutralLight,
                                        },
                                    }}
                                >
                                    <MenuItem value={user}>
                                        <Typography>{user}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => dispatch(setLogout())}>
                                        Logg ut
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </FlexBetween>
                    </Box>
                )}
        </FlexBetween>
        )}
        </>
    );
};

export default Navbar;