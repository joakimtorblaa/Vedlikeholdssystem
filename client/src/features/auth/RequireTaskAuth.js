import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import TaskPage from "../../scenes/taskPage";

const RequireTaskAuth = () => {
    const location = useLocation();
    const { id } = useParams();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [task, setTask] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);


    const getTaskAndType = async () => {
        const responseType = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${user}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const dataType = await responseType.json();
        if (dataType === 'admin') {
            setIsAdmin(true);
        }

        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/tasks/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        if (data.length <= 0) {
            setTask(null);
        } else {
            if(data.userId === user){
                setIsAuth(true);
                setTask(data);
            } else if (data.collaborators.includes(user)){
                setIsAuth(true);
                setTask(data);
            } else {
                setTask('No tasks');
            }
            
        }
    }

    useEffect(() => {
        getTaskAndType();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!task) {
        return null;
    }
    
    const content = (isAdmin === true || isAuth === true 
        ? <TaskPage /> 
        : <Navigate to="/home" state={{ from: location }} replace />
        )

    return content;
    
    
}

export default RequireTaskAuth;