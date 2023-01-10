import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import WidgetWrapper from "../components/WidgetWrapper";
import titleNotifications from "../hooks/titleNotifications";

const LocationWidget = (gridAdjust) => {
    const [location, setLocation] = useState(null);
    const token = useSelector((state) => state.token);
    const notifications = useSelector((state) => state.notifications);

    const { id } = useParams();
    
    const getLocation = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            setLocation(data);
    }

    useEffect(() => {
        getLocation();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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
             <Helmet>
                <title>{titleNotifications(notifications)}{locationName}</title>
                <meta name='description' content={locationName}/>
            </Helmet>
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