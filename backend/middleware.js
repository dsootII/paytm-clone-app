const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel } = require('./db');
const { JWT_SECRET } = require('./config');


function authMiddleware (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(411).json({
            msg: "invalid request"
        })
        return
    }
    console.log("middleware log. authorization header received:", authHeader);
    const token = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);

    console.log("middleware log. token received after jwt verification:\n", token);

    try {
        req.body.userId = token.userId;
        next();
    } catch(error) {
        console.log(error);
        res.status(403).json({ msg: "error occured during authorization"});
        return
    }
}

module.exports = {authMiddleware};

