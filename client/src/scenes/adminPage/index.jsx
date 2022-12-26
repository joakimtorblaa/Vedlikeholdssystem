import { Box, useMediaQuery} from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from '../sidebar';

const AdminPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const isNarrowScreen = useMediaQuery("(min-width:1440px)");

    return (
        <Box >
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