import { Box } from '@mui/material';

const UserImage = ({image, size}) => {
    return (
        <Box>
            <img
                style={{objectFit: "cover", borderRadius: "50%"}}
                width={size}
                height={size}
                alt="Profilbilde"
                src={`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/assets/${image}`}
            />
        </Box>
    )
}

export default UserImage;