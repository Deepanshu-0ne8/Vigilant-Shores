import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token)
        {
            return res.status(401).json({
                success : false,
                message : "User is not Authenticated"
            })
        }
        const decode = await jwt.verify(token, JWT_SECRET);
        if(!decode)
        {
            return res.status(401).json({
                success : false,
                message : "Invalid Token"
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' ,error: error.message }); 
    }
}