import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setHelmetNotifications } from "../state";
import getAllNotifications from "../hooks/getAllNotifications"

const NotificationComponent = ({socket}) => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [unreadNotifications, setUnreadNotifications] = useState();
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const location = useLocation();
    const [locationPath, setLocationPath] = useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.target);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getUserNotifications = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications/${user}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const fetchedNotifications = await response.json();
        if (fetchedNotifications) {
            setNotifications(fetchedNotifications.notifications);
            const totalNotifications = await getAllNotifications(user, token);
            dispatch(
                setHelmetNotifications({notifications: totalNotifications})
            )
            if (!location.pathname.includes('notifications')) {
                setUnreadNotifications(fetchedNotifications.unreadNotifications);
            } else {
                setUnreadNotifications(0);
            }
        } else {
            setNotifications(null);
        }
        
    }
    const setOpenedNotification = async (id, location) => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications/opened/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const patchedNotification = await response.json();
        if (patchedNotification) {
            setUnreadNotifications(unreadNotifications-1);
            dispatch(
                setHelmetNotifications(await getAllNotifications(user, token))
            )
            navigate(location);
            handleClose();
        }
    }

    const openNotification = (location) => {
        navigate(location);
        handleClose();
    } 

    const showAllNotifications = () => {
        navigate("/notifications");
        setLocationPath(true);
        handleClose();
    }
    
    const getLocationAndLoadNotifications = (id) => {
        if (id === user) {
            if (location.pathname === '/notifications') {
                setLocationPath(true);
                setUnreadNotifications(0);
            } else {
                setLocationPath(false);
                getUserNotifications();
            }
        }
    }

    useEffect(() => {
        getLocationAndLoadNotifications(user);
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('newNotification', (id) => getLocationAndLoadNotifications(id));
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!notifications) {
        if (locationPath === true) {
            return (
                <IconButton disabled={locationPath}>
                    <Notifications sx={{ fontSize: "25px" }} />
                </IconButton>
            )
        } else {
            return (
                <IconButton>
                    <Notifications sx={{ fontSize: "25px" }} />
                </IconButton>
            )
        }
    }

    return (
        <>
         <IconButton
            onClick={handleClick}
            aria-controls={open ? 'notifications' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            disabled={locationPath}
         >
            <Badge badgeContent={unreadNotifications} max={10} color="primary">
                <Notifications sx={{ fontSize: "25px" }} />
            </Badge>
         </IconButton>
         <Menu
            anchorEl={anchorEl}
            id="notifications"
            open={open}
            onClose={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 25,
                    height: 25,
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
            {notifications.length === 0 ? (
                <MenuItem>
                No notifications
                </MenuItem>
            ) : (
                notifications.map(item => (
                    item.opened === true ? (
                        <MenuItem key={item._id} onClick={() => openNotification(item.location)}>
                            <ListItemText primary={item.content} secondary={item.createdAt} />
                        </MenuItem> 
                    ) : (
                        <MenuItem sx={{ backgroundColor: palette.background.alt}} key={item._id} onClick={() => setOpenedNotification(item._id, item.location)}>
                            <ListItemText primary={item.content} secondary={item.createdAt} />
                        </MenuItem>
                    )
                ))
            )}
            {notifications.length === 0 ? (
                <MenuItem dense={true} onClick={() => showAllNotifications()}>
                    <ListItemText primary={"Notifikasjoner"} />
                </MenuItem>
            ) : (
                <MenuItem dense={true} onClick={() => showAllNotifications()}>
                    <ListItemText primary={"Vis alle notifikasjoner"} />
                </MenuItem>
            )}
         </Menu>
        </>
    )
}

export default NotificationComponent;