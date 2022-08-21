const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

const verifyOtp = async (req, res, next) => {
    const decodedVerificationData = await jwt.verify(req.body.verificationToken, jwtSecret)
    const correctOtp = decodedVerificationData.otp === req.body.otp;
    const correctUser = decodedVerificationData.userEmail === req.body.email;
    const expired = new Date() > new Date(decodedVerificationData.validDate);
    if (!correctOtp) {
        let response = {
            success: false,
            msg: 'Please enter correct OTP',
        }
        res.status(400).json(response);
        return
    }

    if (!correctUser) {
        let response = {
            success: false,
            msg: 'Can`t verify Email',
        }
        res.status(400).json(response);
        return
    }

    if (expired) {
        let response = {
            success: false,
            msg: 'OTP is expired',
        }
        res.status(400).json(response);
        return
    }
    next();
}

module.exports = verifyOtp;