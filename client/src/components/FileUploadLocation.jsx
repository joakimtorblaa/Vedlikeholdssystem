import {
    Box,
    Button,
    Typography,
    useTheme,
} from '@mui/material'
import { EditOutlined } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';

import Dropzone from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import FlexBetween from './FlexBetween';

const fileSchema = yup.object().shape({
    file: yup.string().required()
});

const initialFileValues = {
    file: ""
}

const FileUploadLocation = () => {
    const { palette } = useTheme();
    const { locationId } = useParams();
    const navigate = useNavigate();


    const uploadFileLocation = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('filePath', values.file.name);
        const savedFileResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${locationId}/newFile`,
            {
                method: "PATCH",
                body: formData
            }
        );
        const savedFile = await savedFileResponse.json();
        onSubmitProps.resetForm();
    
        if(savedFile) {
            console.log("Added new file to location"); 
            navigate(0);
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await uploadFileLocation(values, onSubmitProps);
    }
    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialFileValues}
            validationSchema={fileSchema}
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
                    <Box>
                        <Dropzone
                            acceptedFiles=".jpg, .jpeg, .png"
                            multiple={false}
                            onDrop={(acceptedFiles) => 
                                setFieldValue("file", acceptedFiles[0])
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
                                    {!values.file ? (
                                        <p>Last opp fil her</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{values.file.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                            )}
                        </Dropzone>
                    </Box>
                    <Box>
                        <Button 
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.primary.light,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            LAST OPP FIL
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default FileUploadLocation;