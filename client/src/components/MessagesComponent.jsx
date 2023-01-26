import { Message } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const NotificationComponent = ({socket}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [badgeCounter, setBadgeCounter] = useState(0);

    const getUnreadMessages = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/allUnread/${user}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();

        if (data) {
            setBadgeCounter(data);
        } else {
            setBadgeCounter(0);
        }
    }
    const patchMessageIcon = (id) => {
        if (id.recipient[0] === user) {
            getUnreadMessages();
        }
    }

    const patchReadMessage = (id) => {
        if (id.user === user) {
            getUnreadMessages();
        }
    }


    useEffect(() => {
        getUnreadMessages();
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        socket.on('notifyUserChat', (data) => patchMessageIcon(data))
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps
        
    useEffect(() => {
        socket.on('setReadMessage', (data) => patchReadMessage(data));
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <IconButton
                onClick={() => navigate('/messages')}
            >
                {location.pathname.includes('/messages') ? (
                    <Badge badgeContent={0} max={5} color="primary">
                        <Message sx={{ fontSize: "25px" }} />
                    </Badge>
                ) : (
                <Badge badgeContent={badgeCounter} max={5} color="primary">
                    <Message sx={{ fontSize: "25px" }} />
                </Badge>
                )}
            </IconButton>
        </>
    )
}

export default NotificationComponent;