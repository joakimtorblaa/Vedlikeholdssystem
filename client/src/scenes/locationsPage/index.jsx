import{ Box } from "@mui/material";
import LocationMap from '../../components/LocationMap';
import { Helmet } from 'react-helmet-async';
import titleNotifications from "../../hooks/titleNotifications";
import { useSelector } from "react-redux";

const LocationsPage = () => {

    const notifications = useSelector((state) => state.notifications);

    return (
        <Box>
            <Helmet>
                <title>{titleNotifications(notifications)}Lokasjoner</title>
                <meta name='description' content='Kart over lokasjoner'/>
            </Helmet>
            <Box height="92vh">
                <LocationMap/>
            </Box>
            
            
        </Box>
    )
}

export default LocationsPage;