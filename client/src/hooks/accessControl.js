const accessControl = ( type ) => {
    const token = type;

    let isUser = null;
    let isAdmin = null;
    
    if (token) {
        
        let roles = [];

        token === 'admin' ? isAdmin = token : isUser = token;
        
        roles = [ isAdmin, isUser ];

        return roles; 
    }

    return { roles: [] }
}

export default accessControl;