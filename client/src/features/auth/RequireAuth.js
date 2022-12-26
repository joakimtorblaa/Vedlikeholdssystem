import { useLocation, Navigate, Outlet } from "react-router-dom";
import accessControl from "../../hooks/accessControl";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const RequireAdminAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user);
    const [roles, setRoles] = useState(null);

    const getUserRole = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}/userType`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json();
        setRoles(accessControl(data));
    }

    useEffect(() => {
        getUserRole();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!roles) {
        return null;
    }
        
    const content = (roles.some(role => allowedRoles.includes(role)) 
        ? <Outlet />
        : <Navigate to="/home" state={{ from: location }} replace />
       )
    return content;
    
}

export default RequireAdminAuth;