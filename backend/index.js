const express = require("express");
const rootRouter = require('./routes/index.js');
const cors = require('cors');


const app = express();

app.use(cors(), express.json());

app.get('/', (req, res) => {
    console.log("it works")
});

app.use('/api/v1', rootRouter);

app.listen(3000, () => console.log("server started"));