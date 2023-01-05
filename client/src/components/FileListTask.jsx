import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    Pagination,
    Typography,
    useTheme,
} from '@mui/material'
import { Close, EditOutlined, UploadFile } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';

import Dropzone from 'react-dropzone';
import { useParams } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FileListItem from './FileListItem';

const fileSchema = yup.object().shape({
    file: yup.string().required()
});

const initialFileValues = {
    file: ""
}

const FileListTask = () => {
    const { palette } = useTheme();
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState(null);
    const [arrayCheck, setArrayCheck] = useState(null);
    const token = useSelector((state) => state.token);

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    let [noOfPages, setNoOfPages] = useState(1);

    const handlePage = (e, value) => {
        //removing e breaks page function of Pagination
        setPage(value)
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const uploadFileTask = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('filePath', values.file.name);
        const savedFileResponse = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/newFile`,
            {
                method: "PATCH",
                body: formData
            }
        );
        const savedFile = await savedFileResponse.json();
        onSubmitProps.resetForm();
    
        if(savedFile) {
            console.log("Added new file to task"); 
            getTaskFiles();
            handleClose();
        }
    }

    const getTaskFiles = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}/taskFiles`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            if (data.length <= 0) {
                setFiles(null);
            } else {
                setArrayCheck(data);
                setFiles(data.slice(0).reverse());
                setNoOfPages(Math.ceil(data.length / itemsPerPage));
            }        
    }

    const findIndexInArray = (file) => {
        return (arrayCheck.indexOf(file))
    }

    useEffect(() => {
        getTaskFiles();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!files) {
        return null;
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await uploadFileTask(values, onSubmitProps);
    }

    return (
        <Box padding="1rem">
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </DialogActions>
                <DialogTitle
                    fontWeight="bold"
                    variant="h4"
                >Last opp ny fil</DialogTitle>
                <DialogContent>
                    <Box width="500px">
                        
                    </Box>
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
                                        acceptedFiles="*"
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
                </DialogContent>
            </Dialog>
            <List>
                {files ? 
                <Box>
                    
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="uploadfile" onClick={handleOpen}>
                                <UploadFile />
                            </IconButton>
                        }
                    >
                        <Typography
                            fontWeight="bold"
                        >
                            Oppgavefiler
                        </Typography>
                    </ListItem>
                    <Divider />
                </Box>
                :
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="uploadfile" onClick={handleOpen}>
                                <UploadFile />
                            </IconButton>
                        }
                    >
                        <Typography
                            fontWeight="bold"
                        >
                            Ingen filer funnet. Klikk på ikonet til høyre for å laste opp.
                        </Typography>
                    </ListItem>
                }
                {!files ?
                    <></>
                    :
                    files
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((file) =>(
                        <FileListItem key={findIndexInArray(file)} fileInfo={file} fileIndex={findIndexInArray(file)} category="tasks"/>
                    ))
                }
                <Box 
                    display="flex"
                    justifyContent="center"
                >
                    <Pagination 
                        count={noOfPages}
                        page={page}
                        onChange={handlePage}
                        defaultPage={1}
                        color="primary"
                        size="medium"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </List>
        </Box>
    )
}

export default FileListTask;