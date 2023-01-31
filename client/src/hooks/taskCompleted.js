const taskCompleted = (status) => {

    if (status === 'Fullført' || status === 'Avsluttet') {
        return true;
    } else {
        return false;
    }

}

export default taskCompleted;