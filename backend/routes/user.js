const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel, AccountModel, TransactionModel } = require('../db');
const { JWT_SECRET } = require('../config');
const {authMiddleware} = require('../middleware');


const userRouter = express.Router();

//SIGNUP ROUTE
//input validation for signup
const signupValidator = z.object({
    username: z.string().email(),
    firstName: z.string().min(2, "first name must have at least 2 characters"),
    lastName: z.string().min(2, "first name must have at least 2 characters"),
    password: z.string().min(6)
});
//route handling
userRouter.post('/signup', async (req, res) => {
    const validatedData = signupValidator.safeParse(req.body);

    console.log("request received on signup route. data in req.body:\n", req.body, "\ndata after safeparsing: \n", validatedData);

    if (validatedData.success) {
        const possibleUser = await UserModel.find({username: req.body.username})
        console.log("checked if user already exists. possible users: ", possibleUser);
        if ( possibleUser.length > 0 ) {
            res.json({msg: "User already exists"});
            console.log("user exists. signup aborted.");
            return
        }
        const newUser = await UserModel.create(req.body);

        console.log("User created, user db id: ", newUser._id);
        
        await AccountModel.create({user: newUser._id, balance: 1 + Math.random()*10000});
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
        
        console.log("Signed token created for user. token: ", token);
        console.log("checking jwt verification within signup route itself: ", jwt.verify(token, JWT_SECRET));
        
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
    username: z.string().email(),
    password: z.string().min(6)
});
//route handling
userRouter.post('/signin', async (req, res) => {
    
    console.log("signin request received. request body:\n", req.body);
    const validatedData = signinValidator.safeParse(req.body);
    console.log("data after safeparsing:\n", validatedData);

    if (validatedData.success) {
        const existingUser = await UserModel.find({ username: req.body.username, password: req.body.password });
        if (existingUser.length > 0) {
            console.log("finding balance of this user...");
            const existingUserAccount = await AccountModel.findOne({user: existingUser[0]._id});
            console.log("balance found: ", existingUserAccount);

            const token = jwt.sign({ userId: existingUser[0]._id }, JWT_SECRET);    
            
            res.status(200).json({
            msg: "Sign-in successful",
            token: token,
            firstName: existingUser[0].firstName,
            lastName: existingUser[0].lastName,
            balance: existingUserAccount.balance
            });

            console.log("checking jwt verification before proceeding.", jwt.verify(token, JWT_SECRET));
            console.log("user has been signed in");
            return
        } else {
            res.status(411).json({
                msg: "You don't have an account, please signup first"
            });
            return
        }
            
    } else {
        res.status(400).json({
            msg: "Invalid inputs"
        })
    }
});

//update user info
const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

userRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        _id: req.body.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

userRouter.get('/bulk', authMiddleware, async (req, res) => {
    console.log(req.query);
    if (req.query.fullName) {
        const [queryFN, queryLN] = req.query.fullName.split(' ');
        console.log("query received for /bulk:\n", req.query);
        const usersFound = await UserModel.find({
            firstName: queryFN,
            lastName: queryLN
        })
    
        const result = [];
        for (let user of usersFound) {
            result.push({
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            });
        }
        res.status(200).json({users: result});
    } else {
        const allUsers = await UserModel.find();
        res.status(200).json({users: allUsers});
    }

    
});

userRouter.get('/dashboard', authMiddleware, async (req, res) => {
    const userId = req.query.userId;

    const user = await UserModel.findById(userId);
    const account = await AccountModel.findOne({user: userId});
    const dashboardDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        balance: account.balance
    }

    res.status(200).json(dashboardDetails);

})

userRouter.get('/transactions', authMiddleware, async (req, res) => {
    const userId = req.query.userId;

    const transactions = await TransactionModel.find({sender: userId});
    res.status(200).json({
        transactions: transactions
    })
})


module.exports = {userRouter};