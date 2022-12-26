import UserComponent from "./UserComponent";

const Collaborators = (info) => {
    return (
        <>
            {info.collaborator.map((colab) => (
                <UserComponent createdBy={colab}/>
            ))}
        </>
    )
}

export default Collaborators;