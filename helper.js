require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;
const bcrypt = require('bcrypt');

function genOtp() {
    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}


function genVerificationToken(userEmail, otp) {
    let now = new Date();
    let validTill = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 5, now.getSeconds());
    let verificationData = {
        otp: otp,
        userEmail: userEmail,
        validDate: validTill
    }

    let verificationToken = jwt.sign(verificationData, jwtSecret)
    return verificationToken
}


async function genSecurePassword(password){
    let salt = await bcrypt.genSalt(10);
    let securedPassword = await bcrypt.hash(password, salt);
return securedPassword
}

module.exports ={genOtp,genVerificationToken,genSecurePassword}