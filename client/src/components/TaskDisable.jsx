import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const TaskDisable = () => {
    const { taskid } = useParams();
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const disableTask = async () => {
        //eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${taskid}/disabled`, 
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const taskResponse = await response.json();
        if (taskResponse) {
            navigate(-1);
        }

    }

    return (
        <Button onClick={() => disableTask()}>
            Slett
        </Button>
    )

}

export default TaskDisable;