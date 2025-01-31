const bcrypt = require('bcrypt');
const user = require('../model/register')
const jwt = require("jsonwebtoken")

const updateUser = async (req, res) => {
    console.log("hello");
    
    console.log(req.body);
    
    const { username, email, password } = req.body;
  
    try {
        const userData = await user.findOne({ username: username });
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) userData.username = username;

        if (email) userData.email = email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userData.password = hashedPassword;
        }

        await userData.save();

        const token = jwt.sign(
            { id: userData._id, username: userData.username },  
            "my_secret_key"
        );

        res.cookie("Token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        }).status(200).json({
            message: "Profile updated successfully",
            user: {
                username: userData.username,  
                email: userData.email         
            }
        });

    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Updating error" });
    }
};





const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await user.create({
            username,
            email,
            password: hashedPassword
        });

        const session = 1000 * 60 * 60 * 24 * 7; 
        const token = jwt.sign(
            { id: newUser.id, isAdmin: true },
            "yogendra2005",
            { expiresIn: session }
        );

        const { password: _ , ...userInfo } = newUser.toObject();
        res.cookie("Token", token, { httpOnly: true, maxAge: session }).status(201) .json(userInfo);

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Failed to create user" });
    }
};

const login = async (req, res)=>{
    const {username, password} = req.body;

    try {
        const userData = await user.findOne({ username });

        if (!userData) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password" 
            });
        }

        const session = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign(
            { id: userData.id,
                isAdmin:true
             },
            "my_secret_key",
            { expiresIn: session }
        );

        const {password:userPassword, ...userInfo} = userData;
        
        res.cookie("Token", token, {
            httpOnly: true,
            maxAge: session,
        }).status(200).json(userInfo);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to fetch the data"
        });
    }
};

const logout = (req, res)=>{
    res.clearCookie("Token").status(200).json({
        message:"logout Succesfully"
    })
}

module.exports = {register, login, logout, updateUser};