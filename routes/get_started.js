const express = require("express")
const { body, validationResult } = require('express-validator');
const { sendOtpUsingEmail } = require("../email_service/email_service");
const { genOtp, genVerificationToken } = require('../helper')
const router = express.Router();
const User = require('../models/User');


router.post('/getstarted', [
    body('email', 'Please enter valid email').isEmail(),
], async (req, res) => {
    // chek validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({ success: false, errors: validationErrors.errors });
        return
    }
    // check validation errors
    try {
        // check for existing user
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.json({ success: false, msg: 'User with this email already exist' });
        }else{
            // if there is not existing user then send otp and verification token
            let otp = genOtp();
            let otpSent = await sendOtpUsingEmail(otp,req.body.email);
            if(otpSent){
                let verificationToken = genVerificationToken(req.body.email, otp);
                res.json({ success: true, verificationToken: verificationToken });
            }else{
                res.json({ success: false, msg:"Could`t send otp" });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
})

module.exports = router;