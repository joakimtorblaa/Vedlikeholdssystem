import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
                    
    padding:"2rem",
    margin:"1rem 1rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius: "1rem",
}));

export default WidgetWrapper;