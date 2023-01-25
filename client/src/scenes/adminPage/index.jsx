import { Box, useMediaQuery} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import titleNotifications from '../../hooks/titleNotifications';

import Sidebar from '../sidebar';

const AdminPage = ({socket}) => {
    
    const notifications = useSelector((state) => state.notifications);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const isNarrowScreen = useMediaQuery("(min-width:1440px)");

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}Admin</title>
                <meta name='description' content='Admin'/>
            </Helmet>
            <Sidebar />
            {isNonMobileScreens ? (
                <Box 
                    paddingLeft="250px"
                >
                    <Outlet />
                </Box>
            ) : isNarrowScreen ? (
                <Box 
                    paddingLeft="250px"
                >
                    <Outlet />
                </Box>
            ) : (
                <Box
                >
                    <Outlet />
                </Box>
            )}
            

        </Box>
    )
}

export default AdminPage;