import { Box, Typography } from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";

const AdminTeamWidget = (gridAdjust) => {

    return (
        <WidgetWrapper sx={{gridRow: gridAdjust.gRow, gridColumn: gridAdjust.gColumn}}>
             <Box>
                <FlexBetween>
                    <Box>
                        <Typography
                            fontWeight="bold"
                            variant="h2"
                        >
                            Teams
                        </Typography>
                    </Box>
                    <Box></Box>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    )
}

export default AdminTeamWidget;