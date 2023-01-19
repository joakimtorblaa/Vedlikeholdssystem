import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id }  = req.params;
        const user = await User.findById(id);
        user.password = undefined;

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        user.password = undefined;
        const formattedUser = user.map(
            ({ _id, fullName, email, phoneNumber, userType, role, team, picturePath }) => {
                return { _id, fullName, email, phoneNumber, userType, role, team, picturePath }
            }
         )
        res.status(200).json(formattedUser);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
} 

export const getMultipleUsers = async (req, res) => {
    try {
        const chatUsers = JSON.parse(req.params.users);
        const allUsers = await Promise.all(
            chatUsers.map((id) => User.findById(id))
        );
        const formattedUsers = allUsers.map(
            ({ _id, fullName, picturePath }) => {
                return { _id, fullName, picturePath };
            }
        )
        res.status(200).json(formattedUsers);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const team = await Promise.all(
            user.team.map((id) => User.findById(id))
        );
        const formattedTeam = team.map(
            ({ _id, fullName, email, phoneNumber, role, picturePath }) => {
                return { _id, fullName, email, phoneNumber, role, picturePath };
            }
        );
        res.status(200).json(formattedTeam);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserType = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const type = user.userType; 
        res.status(200).json(type);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
} 

/* UPDATE */
export const addRemoveTeam = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        const user1 = await User.findById(userId1);
        const user2 = await User.findById(userId2);

        if(user1.team.includes(user2)) {
            user1.team = user1.team.filter((userId1) => userId1 !== userId2);
            user2.team = user2.team.filter((userId1) => userId1 !== userId1)
        } else {
            user1.team.push(userId2);
            user2.team.push(userId1);
        }
        await user1.save();
        await user2.save();

        const team = await Promise.all(
            user1.team.map((userId1) => User.findById(user1))
        );
        
        const formattedTeam = team.map(
            ({ _id, fullName, email, phoneNumber, role, picturePath }) => {
                return { _id, fullName, email, phoneNumber, role, picturePath };
            }
        );
        res.status(200).json(formattedTeam);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
    
}