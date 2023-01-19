import { Box } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import titleNotifications from "../../../hooks/titleNotifications";
import TaskForm from "./Form";

const NewTaskPage = () => {
    const notifications = useSelector((state) => state.notifications);
    return (
        <Box>
        <Helmet>
            <title>{titleNotifications(notifications)}Ny oppgave</title>
            <meta name='description' content='Oppgaveside' />
        </Helmet>
            <Box width="50%" m="2rem auto">
                <TaskForm />
            </Box>
        </Box>
    )
}

export default NewTaskPage;