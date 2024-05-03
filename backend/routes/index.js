const express = require('express');
const {userRouter} = require('./user');
const {accountRouter} = require('./account');

const rootRouter = express.Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/account', accountRouter);

rootRouter.get('/', (req, res) => {
    res.status(200).json({
        msg: "You've reached the root router. hit '/user' or '/account' for data."
    })
});

module.exports = { rootRouter };