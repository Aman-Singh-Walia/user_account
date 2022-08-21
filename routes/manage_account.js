require('dotenv').config();
const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const getLoggedInUserId = require('../middlewares/getLoggedInUserId');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { genSecurePassword } = require('../helper')

// fetch logged in  user data_____________________________________________________________
router.get('/manageaccount/user', getLoggedInUserId, async (req, res) => {
    try {
        let userId = req.body.userId;
        let loggedInUserData = await User.findById(userId).select('-password');
        res.json({ success: true, loggedInUserData: loggedInUserData });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
});

// change logged in user name__________________________________________________________________
router.put('/manageaccount/user/changename', [
    body('newName', 'Name must minimum 3 characters in length').isLength({ min: 3 }),
], getLoggedInUserId, async (req, res) => {
     // chek validation errors
     const validationErrors = validationResult(req);
     if (!validationErrors.isEmpty()) {
         res.status(400).json({ success: false, errors: validationErrors.errors });
         return
     }
     // check validation errors
    try {
        let newName = req.body.newName;
        let userId = req.body.userId;
        await User.findByIdAndUpdate(userId, { name: newName });
        res.json({ success: true, msg: 'Name changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
});

// change logged in user password________________________________________________________________
router.put('/manageaccount/user/changepassword', [
    body('currentPassword', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
    body('newPassword', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
], getLoggedInUserId, async (req,res) => {
     // chek validation errors
     const validationErrors = validationResult(req);
     if (!validationErrors.isEmpty()) {
         res.status(400).json({ success: false, errors: validationErrors.errors });
         return
     }
     // check validation errors

     try {
        let userId = req.body.userId;
        let loggedInUser = await User.findById(userId);
        // check user by comparing password
        let validUser =await bcrypt.compare(req.body.currentPassword,loggedInUser.password);
        if(validUser){
            let securedPassword = await genSecurePassword(req.body.newPassword);
            await User.findByIdAndUpdate(userId,{password : securedPassword});
            res.json({ success: true, msg: 'Password changed successfully' });
        }else{
            res.json({ success: false, msg: 'Invalid current password' });
        }
     } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
     }
});


// delete logged in user____________________________________________________________________________
router.delete('/manageaccount/user/delete',[
    body('password', 'Password must minimum 6 characters in length').isLength({ min: 6 }),
],getLoggedInUserId,async (req,res)=>{
    //  chek validation errors
     const validationErrors = validationResult(req);
     if (!validationErrors.isEmpty()) {
         res.status(400).json({ success: false, errors: validationErrors.errors });
         return
     }
     // check validation errors

     try {
        let userId = req.body.userId;
        let loggedInUser = await User.findById(userId);
        let validUser =await bcrypt.compare(req.body.password,loggedInUser.password);
        if (validUser) {
            await User.findByIdAndDelete(userId);
            res.json({ success: true, msg: 'Account deleted successfully' });
        } else {
            res.json({ success: false, msg: 'Failed to delete account' });
        }
     } catch (error) {
        
     }
})

module.exports = router;
