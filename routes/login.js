require('dotenv').config();
const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

router.post('/login', [
    body('email', 'Please enter valid email').isEmail(),
    body('password', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
], async (req, res) => {
    // chek validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({ success: false, errors: validationErrors.errors });
        return
    }
    // check validation errors


    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            let validUser = await bcrypt.compare(req.body.password, user.password);
            if (validUser) {
                let authToken = jwt.sign({ userId: user.id }, jwtSecret)
                //  send response
                res.json({ success: true, msg: 'Logged in Successfully', authToken: authToken });
            } else {
                res.status(400).json({ success: false, msg: 'Incorrect password' });
            }
        } else {
            res.status(400).json({ success: false, msg: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
})

module.exports = router;