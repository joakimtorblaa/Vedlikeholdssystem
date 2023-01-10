import{ Box, Button } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import titleNotifications from "../../hooks/titleNotifications";
import NavBar from "../navbar";

const HomePage = () => {
    const navigate = useNavigate();
    const notifications = useSelector((state) => state.notifications);

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}Vedlikehold</title>
                <meta name='description' content='Framside for vedlikeholdssystem.'/>
            </Helmet>
            <NavBar />
            <Box>
                <WidgetWrapper>
                    <Box>
                        <Button onClick={() => navigate("/locations")}>
                            Locations
                        </Button>
                    </Box>
                </WidgetWrapper>
            </Box>
        </Box>
    )
}

export default HomePage;