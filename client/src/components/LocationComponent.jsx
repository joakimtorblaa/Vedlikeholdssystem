import { KeyboardArrowDown, KeyboardArrowUp, OpenInNew } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import LocationImage from "./LocationImage";

const LocationComponent = (info) => {
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [toggle, setToggle] = useState(false);

    const getLocation = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${info.locationId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const data = await response.json();
        setLocation(data);
    }

    useEffect(() => {
        getLocation();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!location) {
        return null;
    }
    return (
        <Box>
            {!toggle ? (
                <Box display="flex">
                    <Typography
                        padding="10px 0" 
                        fontWeight="bold"
                    >
                        Lokasjon: {location.locationName}
                    </Typography>
                    <IconButton onClick={() => setToggle(!toggle)}>
                        <KeyboardArrowDown />
                    </IconButton>
                </Box>
            ) : (
                <Box>
                    <Box display="flex">
                        <Typography
                            padding="10px 0" 
                            fontWeight="bold"
                        >
                            Lokasjon: {location.locationName}
                        </Typography>
                        <IconButton onClick={() => setToggle(!toggle)}>
                            <KeyboardArrowUp />
                        </IconButton>
                    </Box>
                    <Box
                        display="flex"
                        sx={{
                            border: 1,
                            borderColor: palette.neutral.light 
                        }} 
                        borderRadius="10px" 
                        padding="5px 5px 0 5px" 
                        marginBottom="5px">
                        <LocationImage image={location.picturePath} altText={location.locationName} size={"140px"}/>
                        <FlexBetween width="100%">
                            <Box padding="5px">
                                <Typography
                                    variant="h3"
                                >
                                    {location.locationName}
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                >
                                    {location.locationType}
                                </Typography>
                                <Typography>
                                    {location.description}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => navigate(`/locations/${location._id}`)}>
                                <OpenInNew/>
                            </IconButton>
                        </FlexBetween>
                        
                    </Box>
                </Box>
            )}
            
            
            
        </Box>
    )
}

export default LocationComponent;