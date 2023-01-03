import { Button, Dialog, DialogActions, DialogContent, DialogContentText, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FileDelete from "../features/auth/FileDeleteAuth";


const FileListItem = (file) => {
    const [open, setOpen] = useState(false);
    const token = useSelector((state) => state.token);
    const { locationId } = useParams();
    const navigate = useNavigate();

    const {
        fieldname,
        originalname,
        encoding,
        mimetype,
        path,
        destination,
        filename,
        size
    } = file.fileInfo;

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

    const deleteFile = async (e) => {
        // eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${locationId}/${e}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
        handleClose();
        navigate(0);
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
                        <Button onClick={() => deleteFile(file.fileIndex)} autoFocus>
                            Slett fil
                        </Button>
                    </DialogActions>
                </Dialog>
                <ListItemButton
                    padding="0"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href=`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}${path.slice(6)}`
                    }}
                >
                    <ListItemText
                        primary={originalname}
                        secondary={convertDate(filename)}
                    />
                </ListItemButton>
            </ListItem>
        </>
    )

    
}

export default FileListItem;