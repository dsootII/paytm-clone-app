const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel, AccountModel, TransactionModel } = require('../db');
const { JWT_SECRET } = require('../config');
const {authMiddleware} = require('../middleware');
const bcrypt = require('bcrypt');


const userRouter = express.Router();

//SIGNUP ROUTE
//input validation for signup
const signupValidator = z.object({
    username: z.string().email(),
    firstName: z.string().min(2, "first name must have at least 2 characters"),
    lastName: z.string().min(2, "last name must have at least 2 characters"),
    password: z.string().min(6)
});
//route handling
userRouter.post('/signup', async (req, res) => {

    const validatedData = signupValidator.safeParse(req.body);
    console.log("data after safeparsing: \n", validatedData);

    if (validatedData.success) {
        const {username, firstName, lastName} = validatedData.data;
        const possibleUser = await UserModel.find({username: username})
        console.log("checked if user already exists. possible users: ", possibleUser);
        if ( possibleUser.length > 0 ) {
            res.json({msg: "User already exists"});
            console.log("user exists. signup aborted.");
            return
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            console.log("password hashing complete. hashed password:\n", hashedPassword);

            const newUser = await UserModel.create({ username, firstName, lastName, password: hashedPassword });
            console.log("User created, user db id: ", newUser._id);
            
            await AccountModel.create({user: newUser._id, balance: 1 + Math.random()*10000});
            console.log("Account created for new user with a random balance.");
            
            const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
            console.log("Signed token created for user. token: ", token);
            console.log("checking jwt verification within signup route itself: ", jwt.verify(token, JWT_SECRET));
            
            res.status(200).json({
                msg: "User created successfully",
                token: token
            });

        } catch (err) {
            res.json({msg: "error occured during signup"})
            return
        }

    } else {
        res.json({ msg: "Invalid inputs "});
        return
    }
});

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
        console.log("finding associated user...");
        const existingUser = await UserModel.findOne({ username: req.body.username }).select("+password");
        console.log("user found:\n", existingUser);
        
        if (existingUser) {
            console.log("validating password...");
            const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
            if (!isPasswordValid) {
                res.json({
                    msg: "invalid password"
                })
                return
            }
            console.log("password validated successfully.")

            console.log("finding balance of this user...");
            const existingUserAccount = await AccountModel.findOne({user: existingUser._id});
            console.log("balance found: ", existingUserAccount.balance);

            const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);    
            
            res.status(200).json({
            msg: "Sign-in successful",
            token: token,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
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

    const sent_transactions = await TransactionModel.find({sender: userId}).populate(['sender', 'receiver']);
    const received_transactions = await TransactionModel.find({receiver: userId}).populate(['sender', 'receiver']);
    console.log("populated transaction document retreived (SENDER):\n", sent_transactions);
    console.log("populated transaction document retreived (RECEIVER):\n", received_transactions);
    res.status(200).json({
        sent_transactions: sent_transactions,
        received_transactions: received_transactions
    })
})


module.exports = {userRouter};