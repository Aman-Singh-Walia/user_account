const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const verifyOtp = require('../middlewares/verify_otp');
const User = require('../models/User');
const { genSecurePassword } = require('../helper')


router.post('/signup', [
    body('email', 'Please enter valid email').isEmail(),
    body('name', 'Name must minimum 3 characters in length').isLength({ min: 3 }),
    body('password', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
], verifyOtp, async (req, res) => {
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
            res.json({ success: false, msg: 'Can`t create account' });
        } else {
            let securedPassword = await genSecurePassword(req.body.password)
            await User.create({ email: req.body.email, name: req.body.name, password: securedPassword });
            res.json({ success: true, msg: 'Account created successfully' });
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
})

module.exports = router;