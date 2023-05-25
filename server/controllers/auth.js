import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            userName,
            fullName,
            email,
            password,
            userType,
            phoneNumber,
            role,
            team,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User ({
            userName,
            fullName,
            email,
            password: passwordHash,
            userType,
            phoneNumber,
            role,
            team,
            picturePath: 'users/' + req.file.filename
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/* LOGIN */
export const login = async (req, res) => {
    
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName: userName });

        if (!user) return res.status(400).json({msg: "User does not exist."});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: "Invalid credentials."});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const type = jwt.sign({ role: user.userType }, process.env.JWT_SECRET);
        delete user.password;


        res.status(200).json({ token, user, type })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}