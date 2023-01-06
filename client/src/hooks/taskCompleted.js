const taskCompleted = (status) => {

    if (status === 'Avsluttet') {
        return true;
    } else {
        return false;
    }

}

export default taskCompleted;