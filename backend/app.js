const express = require('express');
const Task = require('./router/task');
const app = express();
const connectDb = require('./db/connect');
require('dotenv').config();
const cors = require("cors");

const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/task', Task);
app.use('/images', express.static('upload/images'));

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
