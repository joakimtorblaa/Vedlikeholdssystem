import { Button, ListItemText, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import 'moment/locale/nb';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import WidgetWrapper from "../../../components/WidgetWrapper";

const taskSchema = yup.object().shape({
    taskName: yup.string().required("Vennligst fyll inn navn på oppgave"),
    description: yup.string().required("Vennligst legg inn beskrivelse"),
    taskType: yup.string().required("Vennligst velg oppgavetype"),
    startDate: yup.date().required("Vennligst angi startdato på oppgave"),
    deadline: yup.date().when(
        'startDate', (startDate, schema) => {
            if (startDate) {
                const dayAfter = new Date(startDate.getTime() + 86400000);

                return schema.min(dayAfter, 'Sluttdato må være minst en dag etter startdato.');
            }
            return schema;
        }
    ).required()
});

const date = new Date();
const deadlineDate = new Date();

let initialTaskValues = {
    taskName: "",
    description: "",
    taskType: "",
    startDate: date,
    deadline: deadlineDate
}


const TaskForm = () => {
    console.log(date);
    const  { state } = useLocation();
    const { id } = state;
    const { palette } = useTheme();
    const userId = useSelector((state) => state.user);
    const fullName = useSelector((state) => state.fullName);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const [collaborator, setCollaborator] = useState([]);
    const [users, setUsers] = useState();
    const [locations, setLocations] = useState();
    const taskHistory = {   
            id : uuidv4(),
            content : `Oppgave opprettet av ${fullName}`,
            timestamp : `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} kl. ${date.getHours()}:${date.getMinutes()}`,
    }
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const taskTypes = [
        "Vedlikehold",
        "Tilsyn",
        "Oppfølging",
        "Ekstern kontroll",
        "Restaurering"
    ]

    const newTask = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('collaborators', collaborator);
        formData.append('locationId', id);
        formData.append('createdBy', fullName);
        formData.append('userId', userId);
        formData.append('history', JSON.stringify(taskHistory));
        const savedTaskResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/new`,
            {
                method: "POST",
                body: formData
            }
        );
        const savedTask = await savedTaskResponse.json();
        onSubmitProps.resetForm();

        if (savedTask) {
            navigate(`/task/${savedTask._id}`)
        }
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
        const filteredData = data.filter(item => !(item._id === userId));
        setUsers(filteredData);
    }

    const getLocations = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        initialTaskValues.location = id;
        setLocations(data);
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await newTask(values, onSubmitProps);
    }

    const handleChangeMultiple = (e) => {
        setCollaborator(e.target.value);
    }

    useEffect(() => {
        getUsers();
        getLocations();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!locations) {
        return null;    
    }


    return (
        <WidgetWrapper>
            <Box padding="1rem 0">
                <Typography
                    variant="h2"
                    fontWeight={"bold"}
                >
                    Ny oppgave
                </Typography>
            </Box>
            
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialTaskValues}
                validationSchema={taskSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        >
                            <TextField 
                                label="Oppgavetittel"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.taskName}
                                name="taskName"
                                error={Boolean(touched.taskName) && Boolean(errors.taskName)}
                                helperText={touched.taskName && errors.taskName}
                                sx={{ gridColumn: "span 4"}}
                            />
                            <TextField 
                                label="Oppgavebeskrivelse"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={Boolean(touched.description) && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 4"}}
                            />
                            {locations.length !== 0 ? (
                                <TextField
                                    select
                                    label="Lokasjon"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4"}}
                                >
                                    {locations.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            <ListItemText primary={item.locationName}/>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField>
                                    ERROR: Couldnt load locations!
                                </TextField>
                            )}
                            
                            <TextField
                                select
                                label="Oppgavetype"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.taskType}
                                name="taskType"
                                error={Boolean(touched.taskType) && Boolean(errors.taskType)}
                                helperText={touched.taskType && errors.taskType}
                                sx={{ gridColumn: "span 4"}}
                            >
                                {taskTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        <ListItemText primary={type} />
                                    </MenuItem>
                                ))}
                            </TextField>
                            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'nb'}>
                                {isNonMobileScreens ? (
                                    <DesktopDatePicker
                                        label="Startdato for oppgave"
                                        onBlur={handleBlur}
                                        onChange={(newValue) => setFieldValue('startDate', newValue, true)}
                                        disablePast={true}
                                        maxDate={values.deadline}
                                        value={values.startDate}
                                        renderInput={(params) => (
                                            <TextField 
                                                name="startDate"
                                                error={Boolean(touched.startDate) && Boolean(errors.startDate)}
                                                helperText={touched.startDate && errors.startDate}
                                                sx={{ gridColumn: "span 4"}}
                                                {...params}
                                            />
                                        )}
                                    />

                                ) : (
                                    <MobileDatePicker
                                        label="Startdato for oppgave"
                                        onBlur={handleBlur}
                                        onChange={(newValue) => setFieldValue('startDate', newValue, true)}
                                        disablePast={true}
                                        maxDate={values.deadline}
                                        value={values.startDate}
                                        renderInput={(params) => (
                                            <TextField 
                                                name="startDate"
                                                error={Boolean(touched.startDate) && Boolean(errors.startDate)}
                                                helperText={touched.startDate && errors.startDate}
                                                sx={{ gridColumn: "span 4"}}
                                                {...params}
                                            />
                                        )}
                                    />
                                )}
                                {isNonMobileScreens ? (
                                    <DesktopDatePicker
                                        label="Sluttfrist for oppgave"
                                        onBlur={handleBlur}
                                        onChange={(newValue) => setFieldValue('deadline', newValue, true)}
                                        disablePast={true}
                                        minDate={values.startDate}
                                        value={values.deadline}
                                        renderInput={(params) => (
                                            <TextField 
                                                name="deadline"
                                                error={Boolean(touched.deadline) && Boolean(errors.deadline)}
                                                helperText={touched.deadline && errors.deadline}
                                                sx={{ gridColumn: "span 4"}}
                                                {...params}
                                            />
                                        )}
                                    />

                                ) : (
                                    <MobileDatePicker
                                        label="Sluttfrist for oppgave"
                                        onBlur={handleBlur}
                                        onChange={(newValue) => setFieldValue('deadline', newValue, true)}
                                        disablePast={true}
                                        minDate={values.startDate}
                                        value={values.deadline}
                                        renderInput={(params) => (
                                            <TextField 
                                                name="deadline"
                                                error={Boolean(touched.deadline) && Boolean(errors.deadline)}
                                                helperText={touched.deadline && errors.deadline}
                                                sx={{ gridColumn: "span 4"}}
                                                {...params}
                                            />
                                        )}
                                    />
                                )}
                            </LocalizationProvider>
                            <TextField
                                select
                                label="Tilknyttede brukere"
                                onBlur={handleBlur}
                                SelectProps={{
                                    multiple: true,
                                    onChange: handleChangeMultiple
                                }}
                                value={collaborator}
                                name="collaborators"
                                error={Boolean(touched.collaborators) && Boolean(errors.collaborators)}
                                helperText={touched.collaborators && errors.collaborators}
                                sx={{ gridColumn: "span 4"}}
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
                        </Box>
                        <Box>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "2rem 0",
                                    p: "1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.primary.light,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                OPPRETT OPPGAVE
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </WidgetWrapper>
    )
}

export default TaskForm;