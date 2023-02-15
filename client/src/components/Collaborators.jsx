import { AvatarGroup, Box } from "@mui/material";
import CollaboratorComponent from "./CollaboratorComponent";

const Collaborators = (info) => {
    return (
        <Box
            display="flex"
            width="100%"
        >
        {info.collaborator.map((colab) => (
                    <CollaboratorComponent key={colab} createdBy={colab}/>
                ))}
        </Box>      
        
    )
}

export default Collaborators;