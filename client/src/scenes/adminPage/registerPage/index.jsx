import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import titleNotifications from '../../../hooks/titleNotifications';
import Form from './Form';

const RegisterPage = () => {

    const notifications = useSelector((state) => state.notifications);
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)} Admin | Opprett bruker</title>
                <meta name='description' content='Admin - opprett ny bruker'/>
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
                    Opprett ny bruker
                </Typography>
                <Form />
            </Box>
        </Box>
    )

}
export default RegisterPage;