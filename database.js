require('dotenv').config();
const mongoose=require('mongoose');
const mongoURL=process.env.MONGOURL;

//connect to mongo database
const connectToMongo=()=>{
    mongoose.connect(mongoURL,()=>{
        console.log('Connected to mongo successfully');
    });  
};

//export modules
module.exports = connectToMongo;