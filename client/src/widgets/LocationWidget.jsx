import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import WidgetWrapper from "../components/WidgetWrapper";

const LocationWidget = (gridAdjust) => {
    const [location, setLocation] = useState(null);
    const token = useSelector((state) => state.token);

    const { locationId } = useParams();
    
    const getLocation = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${locationId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            setLocation(data);
    }

    useEffect(() => {
        getLocation();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!location) {
        return null;
    }

    const {
        locationName,
        description,
        locationType,
        picturePath
    } = location;

    return (
        <WidgetWrapper sx={{gridRow: gridAdjust.gRow, gridColumn: gridAdjust.gColumn}}>
             <Box width="100%">
                    <Box>
                        <Typography
                            fontWeight="bold"
                            variant="h2"
                        >
                            {locationName}
                        </Typography>
                        <Typography
                            fontWeight="bold"
                            variant="h4"
                        >
                            {locationType}
                        </Typography>
                        <Typography
                        >
                            {description}
                        </Typography>
                    </Box>
                    <Box>
                    <img
                        style={{objectFit: "cover", borderRadius: "5%"}}
                        width="280px"
                        height="auto"
                        alt={locationName}
                        src={`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/assets/${picturePath}`}
                    />
                    </Box>
            </Box>
        </WidgetWrapper>
    )
}

export default LocationWidget;