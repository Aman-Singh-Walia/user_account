require('dotenv').config();
const nodemailer = require('nodemailer');

//variables
let senderEmail = process.env.EMAIL;
let senderPassword = process.env.EMAILPASS

//transporter
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: senderEmail,
        pass: senderPassword
    }
})//transporter


async function sendOtpUsingEmail(otp,receiverEmail){
     //mail options
     let mailOptions = {
        from: senderEmail,
        to: receiverEmail,
        subject: 'Email verification',
        text: `Your otp for email verification is ${otp}`
    }//mail options

    transporter.sendMail(mailOptions,(error,data)=>{
        if(error){
            return false;
        }
    })
    return true
}

module.exports = { sendOtpUsingEmail };