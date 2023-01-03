import { Box } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from 'yup';
import { Button, FormControl, TextField } from "@mui/material";
import handleNotifications from "../hooks/handleNotifications";

const commentSchema = yup.object().shape({
    comment: yup.string().required("Legg til kommentar")
});

const initialCommentValues = {
    comment: '',
}


const TaskCommentBox = (info) => {
    const taskId = useParams();
    const token = useSelector((state) => state.token);
    const fullName = useSelector((state) => state.fullName);
    const [changed, setChanged] = useState(false);

    const addTaskComment = async (values, onSubmitProps) => {
        
        //eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${taskId.taskid}/comments/${values.comment}/${fullName}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            }
        )
        onSubmitProps.resetForm();
        for (let user in info.users) {
            handleNotifications(fullName, `${fullName} la til en kommentar på ${info.task}.`, info.users[user], `/task/${taskId.taskid}`, token);
        }
            
        
        

        //navigate(0); 
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        await addTaskComment(values, onSubmitProps);
    }

    return (
        <Box>
            <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialCommentValues}
            validationSchema={commentSchema}
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
                    <TextField
                        fullWidth
                        label="Kommentar"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.comment}
                        name="comment"
                        error={Boolean(touched.comment) && Boolean(errors.comment)}
                        helperText={touched.comment && errors.comment}
                    >

                    </TextField>
                    <Button type="submit"> 
                        Legg til kommentar
                    </Button>
                </form>
            )}
            </Formik>
        </Box>
    )
}

export default TaskCommentBox;