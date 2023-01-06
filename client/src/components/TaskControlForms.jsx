import { Button, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const TaskAddColabForm = ({currentUsers, createdBy}) => {

    const { id } = useParams();
    const userId = useSelector((state) => state.user);
    const token = useSelector((state) => state.token)
    const [collaborator, setCollaborator] = useState([]);
    const [users, setUsers] = useState([]);
    const [changed, setChanged] = useState(true);

    const addColab = async () => {
        if (collaborator.length === 0) {
            alert('Ingen brukere lagt til!')
            setChanged(true);
        } else {
            
            const collaboratorString = JSON.stringify(collaborator);
            //eslint-disable-next-line
            const response = await fetch(
                `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/collaborators/${collaboratorString}/new`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        }      
    }

    const handleChangeMultiple = (e) => {
        setCollaborator(e.target.value);
        setChanged(false);
    }

    const getUsers = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        let filteredData = data.filter(item => !(item._id === userId));
        filteredData = data.filter(item => !(item._id === createdBy));
        let intersectedData = filteredData.filter(item => !currentUsers.includes(item._id));
        setUsers(intersectedData);
    }

    useEffect(() => {
        getUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box width="400px">
            <Typography padding="0.5rem 0">
                Knytt ny bruker til oppgaven
            </Typography>
            <TextField
                select
                label="Tilknyttede brukere"
                SelectProps={{
                    multiple: true,
                    onChange: handleChangeMultiple
                }}
                value={collaborator}
                name="collaborators"
                fullWidth
            >
            <MenuItem key="0" disabled value="" label="Legg til bruker">
                        Legg til bruker
                    </MenuItem>
                    {users && users.map((user) => (
                    <MenuItem
                        key={user._id}
                        value={user._id}
                    >
                        <ListItemText
                            primary={user.fullName}
                            secondary={user.role}
                        />
                    </MenuItem>
                    ))}
            </TextField>
            <Button disabled={changed} onClick={() => addColab()}>Legg til</Button>
        </Box>
    )

}

const TaskRemoveColabForm = () => {

}

const TaskEditForm = () => {

}

export {TaskAddColabForm, TaskRemoveColabForm, TaskEditForm}