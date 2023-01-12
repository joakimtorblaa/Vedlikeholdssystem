import { Box, Button, Popover, Typography } from '@mui/material';
import MapGL, { Marker, Source } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import LocationImage from '../components/LocationImage';
import FlexBetween from './FlexBetween';
import { useNavigate } from 'react-router-dom';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const LocationMap = () => {

    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const [locations, setLocations] = useState(null);

    const bounds = [
        [ 8.13090, 58.1803  ], //southwest coordinates
        [ 8.15587, 58.1912  ]  //northeast coordinates   
    ]

    const getLocations = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const data = await response.json();
        setLocations(data);
    }

    useEffect(() => {
        getLocations();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* POPOVER CODE */
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);

    const handleClick = (e, popoverId) => {
        setAnchorEl(e.currentTarget);
        setPopoverId(popoverId);
    }
    const handleClose = () => {
        setAnchorEl(null);
        setPopoverId(null);
    }
    
    if (!locations) {
        return null;
    }
    
    return (
        <Box height="100%">
            <MapGL
                initialViewState={{
                    latitude: 58.185,
                    longitude: 8.143,
                    zoom: 17,
                    pitch: 80,
                    bearing: -34
                }}
                maxZoom="20"
                style={{width:"100%", height:"100%"}}
                mapStyle="mapbox://styles/mapbox/satellite-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
                maxBounds={bounds}
                terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
                antialias={true}
            >
            <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
            />
            {
                locations.map((marker) =>(
                   <Marker key={marker._id} longitude={marker.coordsLng} latitude={marker.coordsLat} anchor='bottom'>
                        <Popover
                            open={popoverId === marker._id}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                        >
                            <Box
                                minWidth="300px"
                                minHeight="300px"
                                padding="1rem"
                            >   
                                <LocationImage image={marker.picturePath} altText={marker.locationName} size={"280px"}/>
                                <Typography
                                    textAlign="center"
                                    variant="h4"
                                >
                                    {marker.locationName}
                                </Typography>
                                <Typography
                                    textAlign="center"
                                    fontWeight="bold"
                                >
                                    {marker.locationType}
                                </Typography>
                                <Typography
                                    textAlign="center"
                                >
                                    {marker.description}
                                </Typography>
                                <FlexBetween>
                                    <Button  onClick={() => navigate(`/locations/${marker._id}`)}>
                                        ÅPNE
                                    </Button>
                                    <Button onClick={() => navigate(`/task/new`, { state: { id: marker._id } })}>
                                        NY OPPGAVE
                                    </Button>
                                </FlexBetween>
                                
                            </Box>
                        </Popover>
                        
                            <Place 
                            onClick={(e) => {
                                handleClick(e, marker._id)
                            }}
                            sx={{
                                color:"red",
                                "&:hover": {
                                    cursor: "pointer"
                                }
                            }}
                            />
                        
                   </Marker> 
                ))
            }
            </MapGL>
        </Box>
    )  
}

export default LocationMap;