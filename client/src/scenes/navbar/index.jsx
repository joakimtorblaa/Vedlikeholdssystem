import { useEffect, useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Tooltip,
    Avatar
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
import AccountComponent from '../../components/AccountComponent';

const Navbar = ({socket}) => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fullName = useSelector((state) => state.fullName);
    const userId = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    
    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null;
    }

    const {
        picturePath
    } = user;
    console.log(picturePath);

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
                        <MessageComponent socket={socket}/>
                        <NotificationComponent socket={socket}/>
                        <AccountComponent socket={socket} image={picturePath}/>
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
                            <FormControl variant="standard" value={fullName}>
                                <Select
                                    value={fullName}
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
                                    <MenuItem value={fullName}>
                                        <Typography>{fullName}</Typography>
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