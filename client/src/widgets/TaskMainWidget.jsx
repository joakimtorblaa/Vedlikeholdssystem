import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";
import moment from "moment";
import UserComponent from "../components/UserComponent";
import Collaborators from "../components/Collaborators";
import LocationComponent from "../components/LocationComponent";

const TaskMainWidget = (task) => {
    console.log(task.task);
    return (
        <WidgetWrapper>
            <Box 
                display="grid"
                gridAutoColumns="1fr"
                gap="20px"
                minHeight="100px"
            >
                <Box sx={{gridRow: 1, gridColumn: "span 2"}} gap="10px">
                    <Typography
                        variant="h1"
                        fontWeight="bold"
                    >
                    {task.task.taskName}
                    </Typography>
                    <Typography
                        variant="h3"
                    >
                        {task.task.taskType}
                    </Typography>
                    <LocationComponent locationId={task.task.locationId}/>

                    <Typography paddingTop="5px">
                        <b>Status:</b> {task.task.taskStatus}
                    </Typography>
                    <FlexBetween padding="5px 0">
                        <Typography>
                            <b>Startdato:</b> {moment(task.task.startDate).utc().format('DD.MM.YY')}
                        </Typography>
                        <Typography>
                            <b>Oppgavefrist:</b> {moment(task.task.deadline).utc().format('DD.MM.YY')}
                        </Typography>
                    </FlexBetween>
                    <Divider />
                    <Typography
                        padding="5px 0"
                        variant="h5"
                    >
                        Oppgavebeskrivelse:
                    </Typography>
                    <Typography padding="5px 0">
                        {task.task.description}
                    </Typography>
                    <Divider/>
                    <Typography padding="5px 0">
                        Opprettet den {moment(task.task.createdAt).utc().format('DD.MM.YY')} av:
                    </Typography>
                    <Box width="50%">
                        <UserComponent createdBy={task.task.userId}/>
                    </Box>
                    {task.task.collaborators[0].length > 0 ? (
                        <Box width="50%">
                            <Typography
                                padding="5px 0"
                                variant="h5"
                            >
                                Medvirkende
                            </Typography>
                            <Collaborators collaborator={task.task.collaborators}/>
                        </Box>
                    ) : (
                        <>
                        </>
                    )}
                    
                    
                </Box>
                <Box sx={{gridRow: 1, gridColumn: "span 2"}}>
                    test
                </Box>     
            </Box>
        </WidgetWrapper>
    )
}

export default TaskMainWidget;