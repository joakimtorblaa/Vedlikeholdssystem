import UserComponent from "./UserComponent";

const Collaborators = (info) => {
    return (
        <>
            {info.collaborator.map((colab) => (
                <UserComponent key={colab} createdBy={colab}/>
            ))}
        </>
    )
}

export default Collaborators;