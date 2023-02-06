import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FlexBetween from "../components/FlexBetween";
import moment from "moment";
import UserComponent from "../components/UserComponent";
import Collaborators from "../components/Collaborators";
import LocationComponent from "../components/LocationComponent";
import { useSelector } from "react-redux";

const TaskMainWidget = ({task}) => {
    
    const {
        collaborators,
        createdAt,
        deadline,
        description,
        locationId,
        startDate,
        taskName,
        taskStatus,
        taskType,
        userId
    } = task;
    
    

    /* ADDING RECIEVERS OF NOTIFICATIONS */
    const user = useSelector((state) => state.user);

    let users = [];
    if (userId !== user){
        users.push(userId)
    }
    if (collaborators !== []) {
        collaborators.map((item) => {
            if (item !== user){
                users.push(item)
            }
        })
    }
    /* ADDING RECIEVERS OF NOTIFICATIONS */

    return (
        <Box>
            <Typography
                variant="h1"
                fontWeight="bold"
            >
                {taskName}
            </Typography>
            <Typography
                variant="h3"
            >
                {taskType}
            </Typography>
            <LocationComponent locationId={locationId}/>

            <Typography paddingTop="5px">
                <b>Status:</b> {taskStatus}
            </Typography>
            <FlexBetween padding="5px 0">
                <Typography>
                    <b>Startdato:</b> {moment(startDate).utc().format('DD.MM.YY')}
                </Typography>
                {moment(startDate).isBefore(moment(), 'day') ? (
                    <Typography color="red">
                        <b>Oppgavefrist:</b> {moment(deadline).utc().format('DD.MM.YY')}
                    </Typography>
                 ) : (
                    <Typography>
                        <b>Oppgavefrist:</b> {moment(deadline).utc().format('DD.MM.YY')}
                    </Typography>
                 )}
            </FlexBetween>
            <Divider />
            <Typography
                padding="5px 0"
                variant="h5"
            >
                Oppgavebeskrivelse:
            </Typography>
            <Typography padding="5px 0">
                {description}
            </Typography>
            <Divider/>
            <Typography padding="5px 0">
                Opprettet den {moment(createdAt).utc().format('DD.MM.YY')} av:
            </Typography>
            <Box width="50%">
                <UserComponent createdBy={userId}/>
            </Box>
            {collaborators.length === 0 ? (
                <></>
            ) : (
                <Box width="50%">
                    <Typography
                        padding="5px 0"
                        variant="h5"
                    >
                        Medvirkende
                    </Typography>
                    <Collaborators collaborator={collaborators}/>
                </Box>
            )}
        </Box>
    )
}

export default TaskMainWidget;