import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    MenuItem,
    Popover,
} from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../../../components/FlexBetween';
import MapGL, { Marker } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place } from '@mui/icons-material';
import React, { useState } from 'react';
const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9ha2ltdG9yYmxhYSIsImEiOiJjbGJwODFyanowN3R1M3drZXhjd3dweTR3In0.41YDCZTQzuwNNi9BWUbRyw";

const locationSchema = yup.object().shape({
    locationName: yup.string().required("Legg til lokasjonsnavn"),
    description: yup.string().required("Legg beskrivelse av lokasjon"),
    locationType: yup.string().required(),
    coordsLat: yup.number(),
    coordsLng: yup.number(),
    picture: yup.string().required(),
});

const initialLocationValues = {
    userName: "",
    description: "",
    locationType: "",
    coordsLat: 58.185,
    coordsLng: 8.143,
    picture: "",
}

const LocationForm = () => {
    const { palette } = useTheme();

    const isNonMobile = useMediaQuery("(min-width: 600px)");

    const bounds = [
        [ 8.13090, 58.1803  ],  //southwest coordinates
        [ 8.15587, 58.1912  ]  //northeast coordinates   
    ]

    /* CODE FOR INSERTING MARKERS ON THE MAP */
    const [elements, setElements] = useState([]);
    
    const createNewMarker = (lngLat) => {

        const newElement = React.createElement(Marker, {key: 'ele'+ new Date().getTime(), longitude: lngLat.lng, latitude: lngLat.lat, anchor: "bottom"}, 
        <Place sx={{color:"red"}}/>,); 
        setElements(newElement);
    }
    /* CODE FOR INSERTING MARKERS ON THE MAP */

    /* POPOVER CODE */
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    /* POPOVER CODE */

    const newLocation = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name);
        console.log(values.picture);

        const savedLocationResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/newLocation`,
            {
                method: "POST",
                body: formData
            }
        );
        const savedLocation = await savedLocationResponse.json();
        onSubmitProps.resetForm();

        if (savedLocation) {
            console.log("Added new location");
        }

    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await newLocation(values, onSubmitProps);
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialLocationValues}
            validationSchema={locationSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        <TextField
                            label="Lokasjonsnavn"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.locationName}
                            name="locationName"
                            error={Boolean(touched.locationName) && Boolean(errors.locationName)}
                            helperText={touched.locationName && errors.locationName}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                            label="Beskrivelse av lokasjon"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            name="description"
                            error={Boolean(touched.description) && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                            label="Lokasjonstype"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.locationType}
                            name="locationType"
                            select
                            error={Boolean(touched.locationType) && Boolean(errors.locationType)}
                            helperText={touched.locationType && errors.locationType}
                            sx={{ gridColumn: "span 4"}}
                        >
                            <MenuItem value="" label="Velg lokasjonstype">
                                Velg lokasjonstype
                            </MenuItem>
                            <MenuItem value="Trebygg" label="Trebygg">
                                Trebygg
                            </MenuItem>
                            <MenuItem value="Murbygg" label="Murbygg">
                                Murbygg
                            </MenuItem>
                            <MenuItem value="Drivhus" label="Drivhus">
                                Drivhus
                            </MenuItem>
                            <MenuItem value="Garasje" label="Garasje">
                                Garasje
                            </MenuItem>
                            <MenuItem value="Parkeringsplass" label="Parkeringsplass">
                                Parkeringsplass
                            </MenuItem>
                            <MenuItem value="Verksted" label="Verksted">
                                Verksted
                            </MenuItem>
                            <MenuItem value="Hall" label="Hall">
                                Hall
                            </MenuItem>
                            <MenuItem value="Attraksjon" label="Attraksjon">
                                Attraksjon
                            </MenuItem>
                        </TextField>
                        
                        <Box
                            height="400px"
                         sx={{
                            gridColumn: "span 4"
                         }}
                        >
                            <Box 
                                height="100%"                               
                            >
                                <MapGL
                                    initialViewState={{
                                        latitude: 58.185,
                                        longitude: 8.143,
                                        zoom: 17
                                    }}
                                    maxZoom="20"
                                    style={{width:"100%", height:"100%"}}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    maxBounds={bounds}
                                    onClick={(e) => {
                                        setFieldValue('coordsLat', e.lngLat.lat);
                                        setFieldValue('coordsLng', e.lngLat.lng);
                                        createNewMarker(e.lngLat);
                                    }}
                                >
                                {elements}
                                </MapGL>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                p: "0.5rem",
                            }}
                        >
                            <HelpOutlineOutlined onClick={handleClick}/>
                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Typography
                                    p="1rem">
                                        Klikk og dra for å navigere kartet.
                                        Klikk for å markere ønsket plassering av lokasjon. 
                                        Klikk igjen for å flytte punkt.
                                    </Typography>
                                </Popover>
                            
                        </Box>
                        <Box
                            sx={{
                                p: "0.5rem",
                            }}
                        >
                            <Typography>
                                    Velg lokasjon på kart
                            </Typography>
                        </Box>
                        <TextField
                            label="Breddegrad"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.coordsLat}
                            name="coordsLat"
                            error={Boolean(touched.coordsLat) && Boolean(errors.coordsLat)}
                            helperText={touched.coordsLat && errors.coordsLat}
                            disabled={true}
                            sx={{ gridColumn: "span 1",}}
                        />
                        <TextField
                            label="Lengdegrad"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.coordsLng}
                            name="coordsLng"
                            error={Boolean(touched.coordsLng) && Boolean(errors.coordsLng)}
                            helperText={touched.coordsLng && errors.coordsLng}
                            disabled={true}
                            sx={{ gridColumn: "span 1"}}
                        />
                        <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) => 
                                    setFieldValue("picture", acceptedFiles[0])
                                }
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ "&:hover": {cursor: "pointer"}}}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? (
                                            <p>Last opp lokasjonsbilde her</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{values.picture.name}</Typography>
                                                <EditOutlined />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box>
                    </Box>
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.primary.light,
                                "&:hover": { color: palette.primary.main },
                            }}
                        > 
                        OPPRETT LOKASJON
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default LocationForm;