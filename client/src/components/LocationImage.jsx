import { Box } from '@mui/material';

const LocationImage = ({image, altText}) => {
    return (
        <Box>
            <img
                style={{objectFit: "cover", borderRadius: "5%"}}
                width="280px"
                height="auto"
                alt={altText}
                src={`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/assets/${image}`}
            />
        </Box>
    )
}

export default LocationImage;