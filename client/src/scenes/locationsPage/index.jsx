import{ Box } from "@mui/material";
import NavBar from "../navbar";
import LocationMap from '../../components/LocationMap';
import { Helmet } from 'react-helmet-async';

const LocationsPage = () => {

    return (
        <Box>
            <Helmet>
                <title>Lokasjoner</title>
                <meta name='description' content='Kart over lokasjoner'/>
            </Helmet>
            <Box width="100%" position="fixed" marginBottom="80px">
            <NavBar/>
            </Box>
            <Box paddingTop="80px" height="100vh">
                <LocationMap></LocationMap>
            </Box>
            
            
        </Box>
    )
}

export default LocationsPage;