import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import titleNotifications from "../../hooks/titleNotifications";
import NotificationWidget from "../../widgets/NotificationWidget";

const NotificationPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const notifications = useSelector((state) => state.notifications);
    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}Notifikasjoner</title>
                <meta name='description' content='Liste over notifikasjoner'/>
            </Helmet>
            {isNonMobileScreens ? (
                <Box width="50%" m="2rem auto">
                    <NotificationWidget />
                </Box>
            ) : (
                <Box width="93%" m="2rem auto">
                    <NotificationWidget />
                </Box>
            )}
            
        </Box>
    )
}

export default NotificationPage;