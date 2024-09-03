const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const home = async (req, res) => {
    try{
        res.status(200).send("Welcome to home page using controller");
    }catch(error){
        console.error(error);
    }
};

const register = async (req, res) => {
    try{
        // console.log(req.body);
        const {username, email, phone, password} = req.body;

        const userExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });
        
        if(userExists){
            return res.status(400).json({message: "Username already exists"});
        }; 
        if(emailExists){
            return res.status(400).json({message: "Email already exists"});
        }; 

        

        const userCreated = await User.create({username, email, phone, password});
        res.status(200).json({msg : "registration successful", token: await userCreated.generateToken(), userId: userCreated._id.toString()});
    }catch(error){
        console.error(error);
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const userExist = await User.findOne({email});

        if(!userExist){
            return res.status(400).json({message: "User not found"});
        }

        // const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password);
        if(user){
            res.status(200).json({msg : "login successful", token: await userExist.generateToken(), userId: userExist._id.toString()});
        }else{
            res.status(401).json({message: "Invalid email or password"});
        }
        
    } catch (error) {
        console.error(error);
    }
};

module.exports = {home, register, login};