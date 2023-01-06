import UserComponent from "./UserComponent";

const Collaborators = (info) => {
    console.log(info.collaborator.length);
    return (
        <>

        {info.collaborator.map((colab) => (
                    <UserComponent key={colab} createdBy={colab}/>
                ))}
                
        </>
    )
}

export default Collaborators;