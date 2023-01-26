import { Box } from "@mui/material";
import LocationWidget from "../../widgets/LocationWidget";
import LocationTaskWidget from "../../widgets/LocationTaskWidget";
import LocationFileWidget from "../../widgets/LocationFileWidget";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import LocationTaskArchiveWidget from "../../widgets/LocationTaskArchiveWidget";

const LocationPage = ({socket}) => {
    const theme = useTheme();

    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    return (
        <Box>
            {isNonMobileScreens ? 
                <Box
                    width="70%"
                    p="2rem"
                    m="2rem auto"
                    borderRadius="0.5rem"
                    backgroundColor={theme.palette.background.alt}
                    display="grid"
                    gridAutoColumns="1fr"
                >
                    <LocationWidget gRow="1" gColumn="span 2"/>
                    <LocationFileWidget gRow="1" gColumn="span 2" socket={socket}/>
                    <LocationTaskWidget gRow="2" gColumn="span 2"/>
                    <LocationTaskArchiveWidget gRow="2" gColumn="span 2"/>
                    
                </Box>
            :
                <Box
                    width="80%"
                    p="2rem"
                    m="2rem auto"
                    borderRadius="0.5rem"
                    backgroundColor={theme.palette.background.alt}
                    display="grid"
                    gridAutoColumns="1fr"
                >
                    <LocationWidget gRow="1" gColumn="span 4"/>
                    <LocationFileWidget gRow="2" gColumn="span 4"/>
                    <LocationTaskWidget gRow="3" gColumn="span 4"/>
                    <LocationTaskArchiveWidget gRow="4" gColumn="span 4"/>

                </Box>
            }
            
        </Box>
    )
}

export default LocationPage;