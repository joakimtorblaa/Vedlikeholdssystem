import accessControl from "../../hooks/accessControl";
import { useSelector } from "react-redux";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const FileDelete = ({ allowedRoles, handleOpen }) => {
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


    if (!roles) {
        getUserRole();
        return null;
    }
        
    const content = (roles.some(role => allowedRoles.includes(role)) 
        ?   <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
                <Delete />
            </IconButton>
        : <></>
       )
    return content;
    
}

export default FileDelete;