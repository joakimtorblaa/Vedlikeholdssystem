const handleNotifications = (sender, content, reciever, location, token, socket) => {

    const notification = async () => {
        const formData = new FormData();
        formData.append('sender', sender);
        formData.append('content', content);
        formData.append('reciever', reciever);
        formData.append('location', location);

        //eslint-disable-next-line
        const response = await fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/notifications`,
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        const savedNotification = response.json();

        if(savedNotification) {
            socket.emit('createNotification', (reciever));
        }
    }

    notification();
}

export default handleNotifications;