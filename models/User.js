const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

const user = mongoose.model('user',userSchema);
user.createIndexes();
module.exports = user;