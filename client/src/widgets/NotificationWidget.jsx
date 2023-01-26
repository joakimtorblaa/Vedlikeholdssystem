import { useTheme } from "@emotion/react";
import { DraftsOutlined, MarkunreadOutlined } from "@mui/icons-material";
import { Button, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";
import { setHelmetNotifications } from '../state';

const NotificationWidget = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const unreadNotifications = useSelector((state) => state.notifications);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState(null);
    const [listItems, setListItems] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const getUserNotifications = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications/all/${user}`,
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
            setListItems(fetchedNotifications.slice(0).reverse());
            let totalNotifications = 0;
            for (let item in fetchedNotifications) {
                if (fetchedNotifications[item].opened === false) {
                    totalNotifications++;
                }
            }
            dispatch(
                setHelmetNotifications({notifications: totalNotifications})
            );
            setShowAll(true);
        } else {
            setNotifications(null);
            setShowAll(true);
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
                setHelmetNotifications({notifications: unreadNotifications-1})
            )
            navigate(location);
        }
    }

    const toggleNotification = async (id) => {
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
        console.log(patchedNotification);
        if (!patchedNotification) {
            dispatch(
                setHelmetNotifications({notifications: unreadNotifications-1})
            );
        } else {
            dispatch(
                setHelmetNotifications({notifications: unreadNotifications+1})
            );
        }
    }

    const setAllOpened = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications/reciever/${user}`,
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
                setHelmetNotifications({notifications: 0})
            )
        }
    }

    const openNotification = (location) => {
        navigate(location);
    } 

    const setAll = () => {
        setListItems(notifications);
        setShowAll(true);
    }
    const setUnopened = () => {
        let unopenedItems = [];
        for (let item in notifications) {
            if (notifications[item].opened === false) {
                unopenedItems.push(notifications[item]);
            }
        }
        setListItems(unopenedItems);
        setShowAll(false);
    }

    useEffect(() => {
        getUserNotifications();
    }, [unreadNotifications]) //eslint-disable-line react-hooks/exhaustive-deps

    if (!notifications) {
        return false;
    }

    return (
        <WidgetWrapper>
            <Typography
                variant="h2"
                fontWeight={"bold"}
            >
                Notifikasjoner
            </Typography>
            <FlexBetween>
                <Box>
                    <Button onClick={() => setAll()}>
                        Alle
                    </Button>
                    <Button onClick={() => setUnopened()}>
                        Uåpnede
                    </Button>
                </Box>
                <Box>
                    <Button onClick={() => setAllOpened()}>
                        Marker alle som lest
                    </Button>
                </Box>
            </FlexBetween>
            
            
            <Box>
                <List>
                    {listItems.length === 0 && showAll === true ? (
                        <ListItem>
                            Ingen notifikasjoner.
                        </ListItem>
                    ) 
                    : listItems.length === 0 && !showAll ? (
                        <ListItem>
                            Ingen uåpnede notifikasjoner.
                        </ListItem>
                    ) : (
                        listItems.map(item => (
                            item.opened === true ? (
                                <ListItem key={item._id} secondaryAction={
                                    <Tooltip title="Marker som uåpnet">
                                        <IconButton onClick={() => toggleNotification(item._id)}>
                                            <DraftsOutlined />
                                        </IconButton>
                                    </Tooltip>
                                }>
                                    <ListItemText onClick={() => openNotification(item.location)} primary={item.content} secondary={item.createdAt} />
                                </ListItem> 
                            ) : (
                                <ListItem secondaryAction={
                                    <Tooltip title="Marker som åpnet">
                                        <IconButton onClick={() => toggleNotification(item._id)}>
                                            <MarkunreadOutlined />
                                        </IconButton>
                                    </Tooltip>

                                }
                                sx={{ backgroundColor: palette.neutral.light}} key={item._id} >
                                    <ListItemText onClick={() => setOpenedNotification(item._id, item.location)} primary={item.content} secondary={item.createdAt} />
                                </ListItem>
                            )
                        ))
                    )}
                </List>
            </Box>
        </WidgetWrapper>
    )
}

export default NotificationWidget;