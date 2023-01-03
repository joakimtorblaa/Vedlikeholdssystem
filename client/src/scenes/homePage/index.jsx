import{ Box, Typography, useTheme, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import NavBar from "../navbar";

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
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