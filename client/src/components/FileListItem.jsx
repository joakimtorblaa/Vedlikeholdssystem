import { Button, Dialog, DialogActions, DialogContent, DialogContentText, ListItem, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FileDelete from "../features/auth/FileDeleteAuth";
import handleNotifications from "../hooks/handleNotifications";


const FileListItem = ({fileInfo, fileIndex, users, location, category, socket}) => {
    const [open, setOpen] = useState(false);
    const token = useSelector((state) => state.token);
    const fullName = useSelector((state) => state.fullName);
    const { id } = useParams();

    const {
        originalname,
        path,
        filename,
    } = fileInfo;

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const convertDate = (dateString) => {
        let d = new Date(0);
        dateString = dateString.substring(0, 13);
        d.setTime(dateString);
        return d.toLocaleString('no-NO');
    }

    const deleteFile = async (index) => {
        // eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/${category}/${id}/${index}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            if(category === 'tasks'){
                if (!users) {
                    console.log('No users, not creating notification.')
                } else {
                    for (let user in users) {
                        handleNotifications(fullName, `${fullName} slettet ${originalname} fra ${location}.`, users[user], `/task/${id}`, token, socket)
                    }
                    socket.emit('taskFile', id);
                }
            } else if (category === 'locations') {
                socket.emit('locationFile', id);
            }
            
        handleClose();
    }


    return (
        <>
            <ListItem 
                secondaryAction={
                    <FileDelete allowedRoles={'admin'} handleOpen={handleOpen} />
            }>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Er du sikker på at du vil slette {originalname}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Avbryt</Button>
                        <Button onClick={() => deleteFile(fileIndex)} autoFocus>
                            Slett fil
                        </Button>
                    </DialogActions>
                </Dialog>
                <Tooltip title={`Åpne fil i ny fane`} enterDelay={1000} leaveDelay={200}>
                    <ListItemButton
                        padding="0"
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}${path.slice(6)}`, '_blank')
                        }}
                    >
                        <ListItemText
                            primary={originalname}
                            secondary={convertDate(filename)}
                        />
                    </ListItemButton>
                </Tooltip>
            </ListItem>
        </>
    )

    
}

export default FileListItem;