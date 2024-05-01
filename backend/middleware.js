const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel } = require('./db');
const { JWT_SECRET } = require('./config');


export default function authMiddleware (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(411).json({
            msg: "invalid request"
        })
    }
    const token = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    try {
        req.userId = token.userId;
        next();
    } catch(error) {
        console.log(error);
        res.status(403).json({ msg: "error occured during authorization"});
        return
    }
}

