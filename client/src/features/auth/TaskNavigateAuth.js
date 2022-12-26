import { OpenInNew } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TaskNavigateAuth = (taskAuth) => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [check, setCheck] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const getUserType = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${user}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        if (data === 'admin') {
            setIsAdmin(true);
        }

    }
    const getAuth = () => {

            if(taskAuth.taskAuth.userId === user){
                setIsAuth(true);
            } else if (taskAuth.taskAuth.collaborators.includes(user)){
                setIsAuth(true);
            }
            
            setCheck(true);
    }

    useEffect(() => {
        getUserType();
        getAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!check) {
        return null;
    }
    
    const content = (isAuth === true || isAdmin === true
    ?   <IconButton edge="end" aria-label="open-in-new" onClick={() => navigate(`/task/${taskAuth.taskAuth._id}`)}>
            <OpenInNew/>
        </IconButton>
    : <></>
    )
    return content;
}

export default TaskNavigateAuth;