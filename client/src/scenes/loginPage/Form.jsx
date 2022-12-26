import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';

const loginSchema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().required(),
});

const initialLoginValues = {
    userName: "",
    password: "",
}

const Form = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    
    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(values),
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user._id,
                    token: loggedIn.token,
                    type: loggedIn.type,
                    fullName: loggedIn.user.fullName,
                })
            );
            navigate("/home");
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await login(values, onSubmitProps);
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialLoginValues}
            validationSchema={loginSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) =>(
                <form onSubmit={handleSubmit}>
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
                        LOGG INN
                        </Button>
                        <Typography sx={{color: palette.primary.main}}>
                            Problemer med å logge inn? Ta kontakt med systemansvarlig.
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form;