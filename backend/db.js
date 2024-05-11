const mongoose = require('mongoose');
const { Schema, date, tuple } = require('zod');
const { MONGO_CONNECT_URL } = require('./config');


mongoose.connect(MONGO_CONNECT_URL);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        sparse: true
    }]
});

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    balance: {
        type: Number,
        minLength: 0,
        required: true
    }
})

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);
const AccountModel = mongoose.model('Account', accountSchema);
const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = { UserModel, AccountModel, TransactionModel }

