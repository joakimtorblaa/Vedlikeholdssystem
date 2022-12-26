import{ Box } from "@mui/material";
import NavBar from "../navbar";
import LocationMap from '../../components/LocationMap';

const LocationsPage = () => {

    return (
        <Box>
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