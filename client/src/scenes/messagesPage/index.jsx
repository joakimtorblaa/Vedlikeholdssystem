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
import { ChatList, NewChat } from "../../components/ChatComponents";
import { Outlet } from "react-router-dom";

const messageSchema = yup.object().shape({
    content: yup.string().required("Melding kan ikke være tom")
});

const initialValues = {
    content: ""
}

const MessagesPage = ({socket}) => {
    const notifications = useSelector((state) => state.notifications);

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
                        <Box height="100%" display="flex" flexDirection="column">
                            <ChatList socket={socket}/>
                            <NewChat />
                        </Box>
                        
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