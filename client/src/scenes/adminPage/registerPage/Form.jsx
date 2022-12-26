import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    MenuItem,
    FormControl
} from '@mui/material';
import EditOutlineIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';

import Dropzone from 'react-dropzone';
import FlexBetween from '../../../components/FlexBetween';

const registerSchema = yup.object().shape({
    userName: yup.string().required("Legg til brukernavn"),
    fullName: yup.string().required("Legg til fullt navn"),
    email: yup.string().email("Invalid email").required("Legg til gyldig epostadresse"),
    password: yup.string().required("Passord må minst inneholde 5 tegn"),
    userType: yup.string().required(),
    phoneNumber: yup.number().min(8, "Telefonnummer må minst inneholde 8 siffre").required("Vennligst legg inn et telefonnummer"),
    role: yup.string().required(),
    picture: yup.string().required(),
});
const initialRegisterValues = {
    userName: "",
    fullName: "",
    email: "",
    password: "",
    userType: "",
    phoneNumber: "",
    role: "",
    picture: "",
}

const Form = () => {
    const { palette } = useTheme();

    const isNonMobile = useMediaQuery("(min-width: 600px)");

    const register = async (values, onSubmitProps) => {
        //enable 
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name);

        const savedUserResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/auth/register`,
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            console.log("Added new user");
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await register(values, onSubmitProps);
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialRegisterValues}
            validationSchema={registerSchema}
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
                <FormControl fullWidth onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        <TextField 
                            label="Brukernavn"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.userName}
                            name="userName"
                            error={Boolean(touched.userName) && Boolean(errors.userName)}
                            helperText={touched.userName && errors.userName}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField 
                            label="Fullt navn"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fullName}
                            name="fullName"
                            error={Boolean(touched.fullName) && Boolean(errors.fullName)}
                            helperText={touched.fullName && errors.fullName}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField 
                            label="Epost"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField 
                            label="Passord"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                            select
                            label="Brukertype"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.userType}
                            name="userType"
                            error={Boolean(touched.userType) && Boolean(errors.userType)}
                            helperText={touched.userType && errors.userType}
                            sx={{ gridColumn: "span 4"}}
                        >
                            <MenuItem value="" label="Velg brukertype">
                                Velg brukertype
                            </MenuItem>
                            <MenuItem value="user" label="user">
                                user
                            </MenuItem><MenuItem value="superuser" label="superuser">
                                superuser
                            </MenuItem><MenuItem value="admin" label="admin">
                                admin
                            </MenuItem>
                            <MenuItem value="guest" label="guest">
                                guest
                            </MenuItem>
                        </TextField>
                        <TextField
                            type="number"
                            label="Telefonnummer"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.phoneNumber}
                            name="phoneNumber"
                            error={Boolean(touched.phoneNumber) && Boolean(errors.phoneNumber)}
                            helperText={touched.phoneNumber && errors.phoneNumber}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField 
                            label="Rolle"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.role}
                            name="role"
                            error={Boolean(touched.role) && Boolean(errors.role)}
                            helperText={touched.role && errors.role}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) => 
                                    setFieldValue("picture", acceptedFiles[0])
                                }
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ "&:hover": {cursor: "pointer"}}}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? (
                                            <p>Last opp brukerbilde her</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{values.picture.name}</Typography>
                                                <EditOutlineIcon />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box>
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
                        OPPRETT BRUKER
                        </Button>
                    </Box>
                </FormControl>
            )}
        </Formik>
    )
}

export default Form;