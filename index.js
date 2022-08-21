require('dotenv').config();
const express = require("express");
const cors  = require("cors");
const connectToMongo = require('./database');
const port = process.env.PORT
const app = express();

app.use(cors());
app.use(express.json());

//connect to mongodb local database
connectToMongo();

// Routes
app.use('/',require('./routes/get_started'));
app.use('/',require('./routes/signup'));


//listening app
app.listen(port, () => {
    console.log(`App is listening at port:${port}`);
})
