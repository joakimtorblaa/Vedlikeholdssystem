import { Close, UploadFile } from "@mui/icons-material";
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Divider, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText, 
    Typography
 } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FileUploadLocation from "../components/FileUploadLocation";
import WidgetWrapper from "../components/WidgetWrapper";
import Pagination from "@mui/material/Pagination";
import FileListItem from "../components/FileListItem";

const LocationFileWidget = ({gRow, gColumn, socket}) => {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState(null);
    const [arrayCheck, setArrayCheck] = useState(null);
    const token = useSelector((state) => state.token);
    const { id } = useParams();

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

    const getLocationFiles = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/locations/${id}/locationFiles`,
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

    const handleFileRefresh = (data) => {
        if (data === id){
            getLocationFiles();
        }
    }

    useEffect(() => {
        getLocationFiles();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        socket.on('refreshLocationFiles', (data) => handleFileRefresh(data));
    }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper sx={{gridRow: gRow, gridColumn: gColumn}}>
            <Box>
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
                        <FileUploadLocation/>
                    </DialogContent>
                </Dialog>
                <List
                    dense={true}
                >
                    <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="uploadfile" onClick={handleOpen}>
                                <UploadFile />
                        </IconButton>
                     }>
                        <Typography
                            fontWeight="bold"
                            variant="h4"
                        >
                            Filer
                        </Typography>
                    </ListItem>
                    <Divider/>
                    {!files ?
                    <ListItem key="noFiles">
                        <ListItemText primary="Ingen filer funnet. Klikk på ikonet til høyre for å laste opp en fil til lokasjonen."/>
                    </ListItem>
                    :
                    files
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((file) =>(
                        <FileListItem key={findIndexInArray(file)} fileInfo={file} fileIndex={findIndexInArray(file)} users={null} location={null} category="locations" socket={socket}/>
                    ))
                    }
                    {/* FINN UT AV NEDLASTNING AV FIL LOGIKK OVER */}
                </List>
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
            </Box>
        </WidgetWrapper>
    )
}

export default LocationFileWidget;