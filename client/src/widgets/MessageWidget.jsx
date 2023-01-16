import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import FlexBetween from "../components/FlexBetween";
import titleNotifications from "../hooks/titleNotifications";
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { AttachFile, Send } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import getChatUsers from "../hooks/getChatUsers";
import useGetChatUsers from "../hooks/getChatUsers";
import UserImage from "../components/UserImage";

const messageSchema = yup.object().shape({
    content: yup.string()
});

const initialValues = {
    content: ""
}

const MessageWidget = () => {
    const { id } = useParams();
    const { palette } = useTheme();
    const notifications = useSelector((state) => state.notifications);
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState(['639f97b792ec05464292dcda', user]);
    const [chatUserInfo, setChatUserInfo] = useState(null);

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
            getMessages(data);
        }
    }

    const newMessage = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append('sender', user);
        formData.append('content', values.content);
        formData.append('chatId', id)
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

    const handleFormSubmit = async(values, onSubmitProps) => {

        if (messages === null || messages.length === 0) {
            await newChat(values, onSubmitProps);
        } else {
            await newMessage(values, onSubmitProps);
        }   
    }

    useEffect(() => {
        getMessages(id);
        setChatUserInfo(getChatUsers(chatUsers, token))
    }, []); //eslint-disable-line react-hooks/exhaustive-deps
    
    if (!messages || !chatUserInfo) {
        return null;
    } 

    return(
        <Box height="100%" display="flex" flexDirection="column">
        <Helmet>
            <title>{titleNotifications(notifications)}{id}</title>
            <meta name='description' content='Meldinger' />
        </Helmet>
            <Box 
                display="box"
                height="100%"
                width="100%"
                sx={{ 
                    backgroundColor: palette.neutral.light,
                    borderRadius: 2,
                    }}
            >
                {chatUserInfo.map((item) => (
                    <Box key={item._id}>
                        <UserImage image={item.picturePath} size="40px" />
                        <Typography>
                        {item.fullName}
                        </Typography>
                        
            </Box>
            <Box max-height="15%">
                <Box>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={messageSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                                <TextField
                                    sx={{
                                        paddingTop: "1rem",
                                        height: "15%",
                                    }}
                                    fullWidth
                                    minRows={1}
                                    maxRows={3}
                                    margin="none"
                                    multiline
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.content}
                                    name="content"
                                    error={Boolean(touched.content) && Boolean(errors.content)}
                                    helperText={touched.content && errors.content}
                                />
                                <Button
                                    type="submit"
                                    sx={{
                                        float: "right",
                                        marginTop: "1rem",
                                        marginLeft: "10px",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.light,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                   <Send/>
                                </Button>
                                <Button
                                    sx={{
                                        float: "right",
                                        marginTop: "1rem",
                                        marginRight: "10px",
                                        marginLeft: "10px",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.light,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                   <AttachFile />
                                </Button>
                                
                        </form>
                        
                    )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    )
}

export default MessageWidget;