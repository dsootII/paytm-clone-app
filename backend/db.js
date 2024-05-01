const mongoose = require('mongoose');
const { Schema } = require('zod');

mongoose.connect('mongodb+srv://dsoot53:OZabuxPLSr7YsNGQ@cluster0.nu5mcja.mongodb.net/paytm-users');

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
        minLength: 6
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
    }
});

const accountSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    balance: {
        type: Number,
        minLength: 0,
        required: true
    }
})

const UserModel = mongoose.model('User', userSchema);
const AccountModel = mongoose.model('Account', accountSchema);

module.exports = { UserModel, AccountModel }

