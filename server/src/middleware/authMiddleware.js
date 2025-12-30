import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);//contains userid
            req.user = await User.findById(decoded.id).select('-password');//contaisn all details of user
            next();

        }
        catch (error) {
            return res.status(400), json({ message: 'NO Authorization' });
        }
    }
    else {
        return res.status(400).json({ message: 'Token not available' })
    }
}

export default protect;