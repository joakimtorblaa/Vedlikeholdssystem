import{ Box, Typography, useTheme, useMediaQuery, Button } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import NavBar from "../navbar";

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
            <Helmet>
                <title>Vedlikehold</title>
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