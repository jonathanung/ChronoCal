const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();
const db = process.env.MONGODB_KEY

mongoose.connect(db)
    .then(() => console.log("connected to database"))
    .catch(err => console.log("connection error", err)); 