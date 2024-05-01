const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel, AccountModel } = require('../db');
const { JWT_SECRET } = require('../config');
import authMiddleware from '../middleware';


const userRouter = express.Router();

//SIGNUP ROUTE
//input validation for signup
const signupValidator = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});
//route handling
userRouter.post('/signup', async (req, res) => {
    const validatedData = signupValidator.safeParse(req.body);
    if (validatedData.success) {
        if ( await UserModel.find({username: req.body.username})) {
            res.json({msg: "User already exists"});
            return
        }
        const newUser = await UserModel.create(req.body);
        await AccountModel.create({user: newUser._id, balance: 1 + Math.random()*10000});

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
        res.status(200).json({
            msg: "User created successfully",
            token: token
        });

    } else {
        res.json({ msg: "Invalid inputs "});
        return
    }
})

//SIGNIN ROUTE
//input validation for signin
const signinValidator = z.object({
    username: z.string(),
    password: z.string()
});
//route handling
userRouter.post('/signin', async (req, res) => {
    const validatedData = signinValidator.safeParse(req.body);

    const existingUser = await UserModel.find({ username: req.body.username, password: req.body.password});
    if (!existingUser) {
        res.status(411).json({
            msg: "You don't have an account, please signup first"
        });
        return
    }
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
    res.status(200).json({
        msg: "Sign-in successful",
        token: token
    });
})

//update user info
const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        _id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

userRouter.get('/bulk', authMiddleware, async (req, res) => {
    const query = req.query.filter || "";
    //we don't know if this is firstName or lastName
    const usersFound = await UserModel.find({
        $or: [{
            firstName: {
                $regex: query
            }
        }, {
            lastName: {
                $regex: query
            }
        }]
    });
    const result = [];
    for (let user of usersFound) {
        result.push({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        });
    }
    res.status(200).json({users: result});
});


module.exports = {userRouter};