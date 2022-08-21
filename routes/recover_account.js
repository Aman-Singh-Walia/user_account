require('dotenv').config();
const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { sendOtpUsingEmail } = require("../email_service/email_service");
const { genOtp, genVerificationToken, genSecurePassword } = require('../helper')
const verifyOtp = require('../middlewares/verify_otp');

router.post('/recoveraccount', [
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
        let existingUser = await User.findOne({ email: req.body.email })
        if (!existingUser) {
            res.json({ success: false, msg: 'Account not found !' })
        } else {
            let otp = genOtp();
            let otpSent = await sendOtpUsingEmail(otp,req.body.email);
            if(otpSent){
                let verificationToken = genVerificationToken(req.body.email, otp);
                res.json({ success: true,msg:`An otp has been sent to ${req.body.email}`, verificationToken: verificationToken });
            }else{
                res.json({ success: false, msg:"Could`t send otp" });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
});

// get access of forgotton account
router.post('/recoveraccount/getaccess',[
    body('email', 'Please enter valid email').isEmail(),
    body('newPassword', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
], verifyOtp ,async (req,res)=>{
    // chek validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({ success: false, errors: validationErrors.errors });
        return
    }
    // check validation errors

    try {
        let existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            res.json({ success: false, msg: 'Cant verify email !' });
        } else{
            let securedPassword = await genSecurePassword(req.body.newPassword);
            await existingUser.updateOne({password : securedPassword});
            res.json({success : true , msg : "Account recovered successfully"});
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
})

module.exports = router;