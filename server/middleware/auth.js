import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const verifyRole = async (req, res, next) => {
    try {
        let role = req.header("Authorization")
        if (!role) {
            return (res.status(403).send("Access Denied"));
        }
        if (role.startsWith("Bearer ")) {
            role = role.slice(7, role.length).trimLeft();
        }

        const verifiedRole = jwt.verify(role, process.env.JWT_SECRET);
        req.role = verifiedRole;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}