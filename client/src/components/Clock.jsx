import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const Clock = () => {
    const initialDate = new Date();
    const [clockState, setClockState] = useState(initialDate.toLocaleTimeString("en-US",{ hour12: false}));

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setClockState(date.toLocaleTimeString("en-US",{ hour12: false}));
        }, 1000);
    }, []);

    return (
        <Typography
            fontWeight="bold"
        >
        {clockState}
    </Typography>
    )
}

export default Clock;