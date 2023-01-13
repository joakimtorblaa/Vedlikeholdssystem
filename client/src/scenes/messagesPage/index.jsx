import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import UserComponent from "../../components/UserComponent";
import WidgetWrapper from "../../components/WidgetWrapper";
import titleNotifications from "../../hooks/titleNotifications";
import Navbar from "../navbar";
import * as yup from 'yup';
import { useState } from "react";
import { Send } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { ChatList } from "../../components/ChatComponents";
import { Outlet } from "react-router-dom";

const messageSchema = yup.object().shape({
    content: yup.string().required("Melding kan ikke være tom")
});

const initialValues = {
    content: ""
}

const MessagesPage = () => {
    const { palette } = useTheme();
    const notifications = useSelector((state) => state.notifications);
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [chatUsers, setChatUsers] = useState(['639f97b792ec05464292dcda', user]);

    const newChat = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('sender', user);
        formData.append('content', values.content);
        formData.append('users', chatUsers);

        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/newChat`,
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        if (data) {
            setCurrentChat(data);
            getMessages(data);
        }
    }

    const newMessage = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('sender', user);
        formData.append('content', values.content);
        formData.append('chatId', chatId)
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/new`,
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}`}
            }
        )
    }
    
    const getMessages = async (id) => {
        console.log(id);
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/${id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        setMessages(data);
    }

    return (
        <Box>
        <Helmet>
            <title>{titleNotifications(notifications)}Meldinger</title>
            <meta name='description' content='Meldinger' />
        </Helmet>
        <Navbar/>
            <Box width="60%" height="80vh"  m="2rem auto">
                <WidgetWrapper height="100%">
                    <FlexBetween height="100%">
                        <ChatList />
                            <Box 
                                height="100%"
                                width="100%"
                                paddingLeft="20px"
                            >
                                <Outlet/>
                            </Box>
                    </FlexBetween>
                </WidgetWrapper>
            </Box>
        </Box>
    )
}

export default MessagesPage;