const getChatUsers = (users, token) => {
        const chatUsers = JSON.stringify(users);
        let userInfo = [];
        const fetchPromise = fetch(
            `${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/getMultiple/${chatUsers}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        fetchPromise.then(response => {
            return response.json()
        }).then(users => {
            for (let user in users){
                userInfo.push(users[user]);
            }
        })
        return(userInfo);
}

export default getChatUsers;