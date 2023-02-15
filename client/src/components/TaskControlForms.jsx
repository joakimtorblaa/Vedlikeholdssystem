import { Button, Divider, ListItemText, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import * as yup from "yup";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import 'moment/locale/nb';
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import handleNotifications from "../hooks/handleNotifications";

const TaskAddColabForm = ({currentUsers, createdBy, taskName, socket, handleClose}) => {

    const { id } = useParams();
    const userId = useSelector((state) => state.user);
    const token = useSelector((state) => state.token)
    const fullName = useSelector((state) => state.fullName);
    const navigate = useNavigate();
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
            for (let item in collaborator) {
                handleNotifications(fullName, `${fullName} har lagt deg til ${taskName}.`, collaborator[item], `/task/${id}`, token, socket);
            }
            socket.emit('taskAddCollaborator', (id));
            handleClose();
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

const TaskRemoveColabForm = ({currentUsers, createdBy, taskName, socket, handleClose}) => {
    const { id } = useParams();
    const userId = useSelector((state) => state.user);
    const token = useSelector((state) => state.token)
    const fullName = useSelector((state) => state.fullName);
    const navigate = useNavigate();
    const [collaborator, setCollaborator] = useState([]);
    const [users, setUsers] = useState([]);
    const [changed, setChanged] = useState(true);

    const removeColab = async () => {
        if (collaborator.length === 0) {
            alert('Ingen brukere lagt til!')
            setChanged(true);
        } else {
            
            const collaboratorString = JSON.stringify(collaborator);
            //eslint-disable-next-line
            const response = await fetch(
                `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/collaborators/${collaboratorString}/remove`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            for (let item in collaborator) {
                handleNotifications(fullName, `${fullName} har fjernet deg fra ${taskName}.`, collaborator[item], `/task/${id}`, token, socket);
                socket.emit('taskRemoveCollaborator', ({id: id, user: collaborator[item]}));
            }
            
            handleClose();
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
        let intersectedData = filteredData.filter(item => currentUsers.includes(item._id));
        setUsers(intersectedData);
    }

    useEffect(() => {
        getUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box width="400px">
            <Typography padding="0.5rem 0">
                Fjern bruker fra oppgave
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
                        Fjern bruker
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
            <Button disabled={changed} onClick={() => removeColab()}>Fjern</Button>
        </Box>
    )
    
}

const descSchema = yup.object().shape({
    taskName: yup.string().required("Vennligst fyll inn navn på oppgave"),
    description: yup.string().required("Vennligst legg inn beskrivelse")
});

const typeSchema = yup.object().shape({
    taskType: yup.string().required("Vennligst velg oppgavetype"),
});

const dateSchema = yup.object().shape({
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

const TaskEditForm = ({task, currentUsers, socket, handleClose}) => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { id } = useParams();
    const token = useSelector((state) => state.token);
    const fullName = useSelector((state) => state.fullName);
    const {
        _id,
        taskName,
        description,
        taskType,
        startDate,
        deadline,
        collaborators
    } = task;

    const taskTypes = [
        "Vedlikehold",
        "Tilsyn",
        "Oppfølging",
        "Ekstern kontroll",
        "Restaurering"
    ]

    let initialDescValues = {
        taskName: taskName,
        description: description
    }

    let initialTypeValues = {
        taskType: taskType
    }

    let initialDateValues = {
        startDate: startDate,
        deadline: deadline
    }

    const patchDesc = async (values) => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/patchDesc/${values.taskName}/${values.description}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        if (data) {
            if (values.taskName !== taskName && values.description !== description) {
                //if title and description has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret navn og beskrivelse på oppgaven '${taskName}'.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            else if (values.taskName !== taskName) {
                //if title has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret navn på oppgave '${taskName}' til '${values.taskName}'.`, collaborators[item], `/task/${id}`, token, socket);
                }
            } 
            else if (values.description !== description) {
                //if description has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret oppgavebeskrivelsen til '${taskName}'.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            socket.emit('taskInfoUpdate', (id));
            handleClose();
        }
    }

    const patchType = async (values) => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/patchType/${values.taskType}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        if (data) {
            if (values.taskType !== taskType) {
                //if taskType has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret oppgavetype på '${taskName}' til ${values.taskType}.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            socket.emit('taskInfoUpdate', (id));
            handleClose();
        }
    }

    const patchDate = async (values) => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/patchDate/${values.startDate}/${values.deadline}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const data = await response.json();
        if (data) {
            if (values.startDate !== startDate && values.deadline !== deadline) {
                //if startdate and deadline has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret startdato og oppgavefrist på '${taskName}'.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            else if (values.startDate !== startDate) {
                //if startdate has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret startdato på '${taskName}' til ${moment(values.startDate).utc().format('DD.MM.YY')}.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            else if (values.deadline !== deadline) {
                //if deadline has changed
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret oppgavefrist på '${taskName}' til ${moment(values.deadline).utc().format('DD.MM.YY')}.`, collaborators[item], `/task/${id}`, token, socket);
                }
            }
            socket.emit('taskInfoUpdate', (id));
            handleClose();
        }
    }

    const handleFormDesc = (values, onSubmitProps) => {
        patchDesc(values);
    }

    const handleFormType = (values, onSubmitProps) => {
        patchType(values);
    }

    const handleFormDate = (values, onSubmitProps) => {
        patchDate(values);
    }

    return (
        <Box width="400px">
            <Typography variant="h3" padding="0.5rem 0">
                Endre oppgave
            </Typography>
            <Typography paddingTop="10px" paddingBottom="10px">
                <b>Tittel og beskrivelse</b>
            </Typography>
            <Formik
                onSubmit={handleFormDesc}
                initialValues={initialDescValues}
                validationSchema={descSchema}
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
                        >
                            <TextField 
                                fullWidth
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
                                fullWidth
                                label="Oppgavebeskrivelse"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={Boolean(touched.description) && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 4"}}
                            />
                            
                        </Box>
                        <Button type="submit">Lagre endringer</Button>
                    </form>
                )}
            </Formik>
            <Divider/>
            <Typography paddingTop="10px" paddingBottom="10px">
                <b>Oppgavetype</b>
            </Typography>
            <Formik
                onSubmit={handleFormType}
                initialValues={initialTypeValues}
                validationSchema={typeSchema}
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
                        >
                            <TextField
                                select
                                fullWidth
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
                        </Box>
                        <Button type="submit">Lagre endringer</Button>
                    </form>
                )}
            </Formik>
            <Divider/>
            <Typography paddingTop="10px" paddingBottom="10px">
                <b>Start og sluttdato</b>
            </Typography>
            <Formik
                onSubmit={handleFormDate}
                initialValues={initialDateValues}
                validationSchema={dateSchema}
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
                        >
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
                        </Box>
                        <Button type="submit">Lagre endringer</Button>
                    </form>
                )}
            </Formik>
        </Box>
    )
}

const TaskAddSubtaskForm = ({task, socket, handleClose}) => {
    const token = useSelector((state) => state.token);
    const fullName = useSelector((state) => state.fullName);
    const [tasks, setTasks] = useState(null);
    const [subTasks, setSubTasks] = useState([]);
    const [changed, setChanged] = useState(true);

    const {
        _id,
        locationId,
        taskName,
        collaborators
    } = task;

    const getLocationTasks = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/locationId/${locationId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.length <= 0) {
                setTasks(null);
            } else {
                const filteredData = data.filter((task) => task.taskStatus !== 'Avsluttet' && task.taskStatus !== 'Fullført');
                setTasks(filteredData.slice(0).reverse());
            }
    }
    
    const updateSubTasks = async () => {
        const subTaskString = JSON.stringify(subTasks);
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${_id}/subTask/${subTaskString}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        if (task.subTask.length === data.length && task.subTask.every((value, index) => value === data[index])) {
            handleClose();
        } else {
            if (task.subTask.length > subTasks.length) {
                //fjerne underoppgaver
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} fjernet en eller flere underoppgaver fra '${taskName}'.`, collaborators[item], `/task/${_id}`, token, socket);
                }
                socket.emit('taskUpdateSubtasks', (_id));
                handleClose();
            } else if (task.subTask.length === subTasks.length) {
                //samme antall, men endret underoppgaver
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} endret underoppgaver på '${taskName}'.`, collaborators[item], `/task/${_id}`, token, socket);
                }
                socket.emit('taskUpdateSubtasks', (_id));
                handleClose();
            } else if (task.subTask.length < subTasks.length) {
                //legger til underoppgaver
                for (let item in collaborators) {
                    handleNotifications(fullName, `${fullName} la til en eller flere underoppgaver på '${taskName}'.`, collaborators[item], `/task/${_id}`, token, socket);
                }
                socket.emit('taskUpdateSubtasks', (_id));
                handleClose();
            }
        }
    }

    useEffect(() => {
        getLocationTasks();
        setSubTasks(task.subTask);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChangeMultiple = (e) => {
        setSubTasks(e.target.value);
        setChanged(false);
    }

    return (
        <Box width="400px">
            <Typography padding="0.5rem 0">
                Legg til 
            </Typography>
            {!tasks ? (
                <></>
            ) : (
                <Box>
                    <TextField
                        select
                        label="Underoppgaver"
                        SelectProps={{
                            multiple: true,
                            onChange: handleChangeMultiple
                        }}
                        value={subTasks}
                        name="collaborators"
                        fullWidth
                    >
                    <MenuItem key="0" disabled value="" label="Legg til bruker">
                                Fjern bruker
                            </MenuItem>
                            {tasks.map((task) => (
                            <MenuItem
                                key={task._id}
                                value={task._id}
                            >
                                <ListItemText
                                    primary={task.taskName}
                                    secondary={task.taskStatus}
                                />
                            </MenuItem>
                            ))}
                    </TextField>
                    <Button disabled={changed} onClick={() => updateSubTasks()}>Oppdater</Button>
                </Box>
            )}
        </Box>
    )
}

export {TaskAddColabForm, TaskRemoveColabForm, TaskEditForm, TaskAddSubtaskForm}