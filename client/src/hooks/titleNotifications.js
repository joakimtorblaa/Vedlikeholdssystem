const titleNotifications = ( notifications ) => {
    if (notifications > 0) {
        return (
            `(${notifications}) `
        )
    } else {
        return ('')
    }
}
export default titleNotifications