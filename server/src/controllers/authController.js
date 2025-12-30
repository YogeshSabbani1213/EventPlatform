import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import generateToken from "../utils/generateToken.js";

export default async function registerUser(req, res) {
    try {

        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required'});
        }

        const userexists = await UserModel.findOne({ email });
        if (userexists) {
            return res.status(400).json({ message: 'user already exists' })
        }

        const hasedPassword = await bcrypt.hash(password, 10)

        //we need add entry with model 
        const newUser = await UserModel.create({ username, email, password: hasedPassword })      //returns promise
        return res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id)
        })
    }
    catch (error) {
        console.error("REGISTER ERROR ", error);
        return res.status(500).json({ message: 'registration Unsuccessful', error: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);//true or false
        if (!isMatch) {
            return res.status(404).json({ message: 'password is incorrect' })
        }

        return res.status(200).json({message:'login sucessful',
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    catch (error) {
        return res.status(500).json({ message:'login unsuccesful',error:error.message});
    }
}

export async function fetchUser(req, res) {
    try {
        const data = await UserModel.find({});
        if (!data) {
            return res.status(400).json({ message: 'no users found' });
        }
        return res.status(201).json({ 'data': data })
    }
    catch (error) {
        return res.status(400).json({ "ErrorMessage": error })
    }
}