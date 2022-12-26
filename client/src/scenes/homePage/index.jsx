import{ Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import NavBar from "../navbar";

const HomePage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
            <NavBar />
        </Box>
    )
}

export default HomePage;