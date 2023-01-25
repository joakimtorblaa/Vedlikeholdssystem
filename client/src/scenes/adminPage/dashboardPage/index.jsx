import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import {
    Message,
    DarkMode,
    LightMode,
    Settings
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../../state";
import AdminUserWidget from "../../../widgets/AdminUserWidget";
import AdminTeamWidget from "../../../widgets/AdminTeamWidget";
import AdminLocationWidget from "../../../widgets/AdminLocationWidget";
import AdminTaskWidget from "../../../widgets/AdminTaskWidget";
import FlexBetween from "../../../components/FlexBetween";
import Clock from "../../../components/Clock";
import NotificationComponent from "../../../components/NotificationComponent";
import MessageComponent from '../../../components/MessagesComponent';
import { Helmet } from "react-helmet-async";
import titleNotifications from "../../../hooks/titleNotifications";

const DashboardPage = ({socket}) => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications);
    const theme = useTheme();

    const dark = theme.palette.neutral.dark;

    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const isNarrowScreen = useMediaQuery("(min-width:1440px)");

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}Admin | Dashboard</title>
                <meta name='description' content='Admin dashboard'/>
            </Helmet>
            {isNarrowScreen ? (                  
                <Box
                    display="grid"
                    gridAutoColumns="1fr"
                    gap="0"
                    height="100vh"
                >   
                    <Box sx={{gridRow: 1, gridColumn: "span 4"}}>
                        <FlexBetween padding="0.5rem 1.5rem">
                            <FlexBetween>
                                <Clock />
                            </FlexBetween>
                            <FlexBetween>
                                <IconButton onClick={() => dispatch(setMode())}>
                                {theme.palette.mode === "dark" ? (
                                    <DarkMode sx={{ fontSize: "25px" }} />
                                ) : (
                                    <LightMode sx={{ color: dark, fontSize: "25px"}} />
                                )}
                                </IconButton>
                                <MessageComponent socket={socket}/>
                                <NotificationComponent socket={socket}/>
                                <IconButton>
                                    <Settings />
                                </IconButton>
                            </FlexBetween>
                        </FlexBetween>
                    </Box>
                    <AdminUserWidget gRow="2" gColumn="span 1"/>
                    <AdminTeamWidget gRow="2" gColumn="span 1"/>
                    <AdminLocationWidget gRow="2" gColumn="span 2"/>
                    <AdminTaskWidget gRow="3" gColumn="span 4"/>
                </Box>
                ) : isNonMobileScreens ? (
                <Box
                    display="grid"
                    gridAutoColumns="1fr"
                    gap="0"
                    height="100vh"
                >
                    <Box sx={{gridRow: 1, gridColumn: "span 4"}}>
                        <FlexBetween padding="0.5rem 1.5rem">
                            <FlexBetween>
                                <Clock />
                            </FlexBetween>
                            <FlexBetween>
                                <IconButton onClick={() => dispatch(setMode())}>
                                {theme.palette.mode === "dark" ? (
                                    <DarkMode sx={{ fontSize: "25px" }} />
                                ) : (
                                    <LightMode sx={{ color: dark, fontSize: "25px"}} />
                                )}
                                </IconButton>
                                <IconButton>
                                    <Message />
                                </IconButton>
                                <NotificationComponent />
                                <IconButton>
                                    <Settings />
                                </IconButton>
                            </FlexBetween>
                        </FlexBetween>
                    </Box>
                    <AdminUserWidget gRow="2" gColumn="span 2"/>
                    <AdminTeamWidget gRow="2" gColumn="span 2"/>
                    <AdminLocationWidget gRow="3" gColumn="span 4"/>
                    <AdminTaskWidget gRow="4" gColumn="span 4"/>
                </Box>
                ) : (
                <Box>
                    <Box sx={{gridRow: 1, gridColumn: "span 4"}}>
                        <FlexBetween padding="0.5rem 1.5rem">
                            <FlexBetween>
                                <Clock />
                            </FlexBetween>
                            <FlexBetween>
                                <IconButton onClick={() => dispatch(setMode())}>
                                {theme.palette.mode === "dark" ? (
                                    <DarkMode sx={{ fontSize: "25px" }} />
                                ) : (
                                    <LightMode sx={{ color: dark, fontSize: "25px"}} />
                                )}
                                </IconButton>
                                <IconButton>
                                    <Message />
                                </IconButton>
                                <NotificationComponent />
                                <IconButton>
                                    <Settings />
                                </IconButton>
                            </FlexBetween>
                        </FlexBetween>
                        <Box></Box>
                    </Box>
                    <AdminUserWidget gRow="2" gColumn="span 2"/>
                    <AdminTeamWidget gRow="2" gColumn="span 2"/>
                    <AdminLocationWidget gRow="3" gColumn="span 4"/>
                    <AdminTaskWidget gRow="4" gColumn="span 4"/>
                </Box>   
                )}
        </Box>
    )
}

export default DashboardPage;