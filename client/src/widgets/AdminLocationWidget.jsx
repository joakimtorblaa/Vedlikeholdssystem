import { Box, Typography } from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";

const AdminLocationWidget = (gridAdjust) => {
    return (
        <WidgetWrapper sx={{gridRow: gridAdjust.gRow, gridColumn: gridAdjust.gColumn}}>
             <Box>
                <FlexBetween>
                    <Box>
                        <Typography
                            fontWeight="bold"
                            variant="h2"
                        >
                            Locations
                        </Typography>
                    </Box>
                    <Box></Box>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    )
}

export default AdminLocationWidget;