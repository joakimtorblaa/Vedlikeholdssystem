import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setUnreadNotifications } from '../state';

const NotificationComponent = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const unreadNotifications = useSelector((state) => state.notifications);
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
            setNotifications(fetchedNotifications.slice(0).reverse());
            let totalNotifications = 0;
            for (let item in fetchedNotifications) {
                if (fetchedNotifications[item].opened === false) {
                    totalNotifications++;
                }
            }
            dispatch(
                setUnreadNotifications({notifications: totalNotifications})
            );
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

            dispatch(
                setUnreadNotifications({notifications: unreadNotifications-1})
            )
            navigate(location);
            handleClose();
        }
    }

    const openNotification = (location) => {
        navigate(location);
        handleClose();
    } 
    
    const getLocationAndLoadNotifications = () => {
        if (location.pathname === '/notifications') {
            setLocationPath(true);
        } else {
            getUserNotifications();
        }

    }

    useEffect(() => {
        getLocationAndLoadNotifications();
    }, [unreadNotifications]); // eslint-disable-line react-hooks/exhaustive-deps

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
                notifications.slice(0, 10).map(item => (
                    
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
                <MenuItem>
                No notifications
                </MenuItem>
                
            ) : (
                <MenuItem dense={true} onClick={() => navigate("/notifications")}>
                    <ListItemText primary={"Vis alle notifikasjoner"} />
                </MenuItem>
            )}
         </Menu>
        </>
    )
}

export default NotificationComponent;