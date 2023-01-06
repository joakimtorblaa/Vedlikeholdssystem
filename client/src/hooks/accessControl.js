const accessControl = ( type ) => {
    const token = type;

    let isUser = null;
    let isAdmin = null;
    let isCreator = null;
    
    if (token) {
        
        let roles = [];

        token === 'admin' 
            ? isAdmin = token 
            : token === 'creator' 
            ? isCreator = token
            : isUser = token;
        
        roles = [ isAdmin, isCreator, isUser ];

        return roles; 
    }

    return { roles: [] }
}

export default accessControl;