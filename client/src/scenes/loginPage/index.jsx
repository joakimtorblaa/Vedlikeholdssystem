import{ Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Helmet } from "react-helmet-async";
import Form from "./Form";

const LoginPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
            <Helmet>
                <title>Logg inn</title>
                <meta name='description' content='Innloggingsside for Vedlikeholdssystem'/>
            </Helmet>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography
                    fontWeight="bold"
                    fontSize="32px"
                    color="primary"
                    >
                    Vedlikehold
                </Typography>
            </Box>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography
                    fontWeight="500"
                    variant="h5"
                    sx={{ mb: "1.5rem"}}
                    >
                    Vedlikeholdssystem for X
                </Typography>
                <Form />
            </Box>
        </Box>
        
    )
}

export default LoginPage;