import { Box } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import titleNotifications from "../../hooks/titleNotifications";
import { ChatList, NewChat } from "../../components/ChatComponents";
import { Outlet } from "react-router-dom";

const MessagesPage = ({socket}) => {
    const notifications = useSelector((state) => state.notifications);

    return (
        <Box>
        <Helmet>
            <title>{titleNotifications(notifications)}Meldinger</title>
            <meta name='description' content='Meldinger' />
        </Helmet>
            <Box width="60%" height="80vh"  m="2rem auto">
                <WidgetWrapper height="100%">
                    <FlexBetween height="100%">
                        <Box height="100%" display="flex" flexDirection="column">
                            <ChatList socket={socket}/>
                            <NewChat socket={socket}/>
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