import { OpenInNew } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box, } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LocationComponent = (info) => {
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);

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
            <Box display="flex">
                <Typography
                    padding="10px 0" 
                    fontWeight="bold"
                >
                    Lokasjon: {location.locationName}
                </Typography>
                <IconButton onClick={() => navigate(`/locations/${location._id}`)}>
                    <OpenInNew />
                </IconButton>
            </Box>
        </Box>
    )
}

export default LocationComponent;