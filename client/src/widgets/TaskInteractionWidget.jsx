import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import FileListTask from "../components/FileListTask";
import TaskComments from "../components/TaskComments";

const TaskInteractionWidget = ({task, socket}) => {

    const {
        taskName,
        taskStatus,
        userId,
        collaborators
    } = task;
    /* HANDLE TABS */
    const [value, setValue] = useState(0);

    const handleTab = (e, newValue) => {
        setValue(newValue)
    }

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props; 

        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                <Box>
                    {children}
                </Box>
            </Box>
        )
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired
    };

    const a11yProps = (index) => {
        return {
          id: `scrollable-auto-tab-${index}`,
          "aria-controls": `scrollable-auto-tabpanel-${index}`
        };
    }

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
            <Tabs value={value} onChange={handleTab}>
                <Tab label="Kommentarer" {...a11yProps(0)}/>
                <Tab label="Filer" {...a11yProps(1)}/>
            </Tabs>
            <TabPanel value={value} index={0}>
                <TaskComments users={users} task={taskName} status={taskStatus} socket={socket}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <FileListTask users={users} task={taskName} status={taskStatus} socket={socket}/>
            </TabPanel>
        </Box>
    )
}

export default TaskInteractionWidget;