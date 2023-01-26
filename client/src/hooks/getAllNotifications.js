const getAllNotifications = async (id, token) => {
    const messageResponse = await fetch(
        `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/messages/allUnread/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const messageData = await messageResponse.json();

    const notificationResponse = await fetch(
        `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const notificationData = await notificationResponse.json();
    
    if(!messageData && !notificationData) {
        return 0;
    } else {
        return messageData + notificationData.unreadNotifications;
    }
}

export default getAllNotifications;