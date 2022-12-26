import { Box, Typography } from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";

const AdminTaskWidget = (gridAdjust) => {

    return (
        <WidgetWrapper sx={{gridRow: gridAdjust.gRow, gridColumn: gridAdjust.gColumn}}>
            <Box>
                <FlexBetween>
                    <Box>
                        <Typography
                            fontWeight="bold"
                            variant="h2"
                        >
                            Tasks
                        </Typography>
                    </Box>
                    <Box></Box>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    )
}

export default AdminTaskWidget;