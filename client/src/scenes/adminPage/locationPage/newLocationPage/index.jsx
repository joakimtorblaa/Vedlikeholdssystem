import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { Helmet } from "react-helmet-async";
import LocationForm from "../newLocationPage/Form";


const NewLocationPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Helmet>
                <title>Admin | Opprett ny lokasjon</title>
                <meta name='description' content='Admin - Oppretting av ny lokasjon'/>
            </Helmet>
            <Box
                width={isNonMobileScreens ? "80%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="0.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography
                    fontWeight="500"
                    variant="h5"
                    sx={{ mb: "1.5rem" }}
                >
                    Opprett ny lokasjon
                </Typography>
                <LocationForm />
            </Box>
        </Box>
    )
}

export default NewLocationPage;