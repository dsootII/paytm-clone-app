const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel, AccountModel, TransactionModel } = require('../db');
const { JWT_SECRET } = require('../config');
const {authMiddleware} = require('../middleware');
const mongoose = require('mongoose');

const accountRouter = express.Router();

accountRouter.get('/balance', authMiddleware, async (req, res) => {
    console.log(req.body.userId);
    const account = await AccountModel.find({ user: req.body.userId });

    console.log("account: ", account);

    if (account) {
        res.status(200).json({
            balance: account[0].balance
        })
    } else {
        res.status(411).json({
            msg: "Error occured"
        })
    }
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;
    console.log("request body received for transfer details:\n", req.body);

    // Fetch the accounts within the transaction
    const account = await AccountModel.findOne({ user: req.body.userId }).session(session);
    console.log("sender account found, ", account);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    console.log("finding receiver account..")
    const toAccount = await AccountModel.findOne({ user: to }).session(session);
    console.log("receiver account found:\n", toAccount);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    console.log("TRANSACTION DETAILS");
    console.log("SENDER: ", req.body.userId);
    console.log("RECEIVER: ", to);
    console.log("AMOUNT: ", amount);

    // Perform the transfer
    await AccountModel.updateOne({ user: req.body.userId }, { $inc: { balance: -amount } }).session(session);
    await AccountModel.updateOne({ user: to }, { $inc: { balance: amount } }).session(session);
    await TransactionModel.create({ sender: {id: req.body.userId}, receiver: {id: to}, amount: amount });

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = { accountRouter }